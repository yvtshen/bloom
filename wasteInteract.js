let img = [];
let dropImg = [];  // new array for the dropping images
let dropping = [];  // array to hold the properties of any currently dropping images
let bgImages = [];  // array to hold the background images
let maxDiameter;
let t;  
let order = [0, 1, 2, 3, 4, 5, 6, 7];
let labels = ["metals 8.76%", "food 21.59%", "plastics 12.20%", "yard trimmings 12.11%", "wood 6.19%","paper+paperboard 23.05%", "rubber+leather+textiles 8.96%", "glass 4.19%"];
let proportions = [8.76, 21.59, 12.2, 12.11, 6.19, 23.05, 8.96, 4.19];
let spacing;
let dropRanges;
let button;



function preload() {
  img[0] = loadImage("https://i.imgur.com/LIbHtI1.png"); //metal
  img[1] = loadImage("https://i.imgur.com/WIPms0y.png"); //food
  img[2] = loadImage("https://i.imgur.com/uhBrKBq.png"); //plastic
  img[3] = loadImage("https://i.imgur.com/otWWi5W.png"); //yard trimming
  img[4] = loadImage("https://i.imgur.com/7QKxS5c.png"); //wood
 img[5] = loadImage("https://i.imgur.com/12xZRub.png"); //paper
  img[6] = loadImage("https://i.imgur.com/ncIC6T1.png"); //rubber leater textile
  img[7] = loadImage("https://i.imgur.com/ero85yV.png"); //glass

  // preload the dropping images
  dropImg[0] = loadImage("https://i.imgur.com/RDD8aUY.png"); //metal
  dropImg[1] = loadImage("https://i.imgur.com/qzRvm6z.png"); //food
  dropImg[2] = loadImage("https://i.imgur.com/ttQaN5h.png"); //plastic
  dropImg[3] = loadImage("https://i.imgur.com/XgFFjBj.png"); //yard trimming
  dropImg[4] = loadImage("https://i.imgur.com/ZQLiSVj.png"); //wood
  dropImg[5] = loadImage("https://i.imgur.com/fyiQjcL.png"); //paper
  dropImg[6] = loadImage("https://i.imgur.com/6wHJV69.png"); //rubber leather textile
  dropImg[7] = loadImage("https://i.imgur.com/JXjpKVh.png"); //glass
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  maxDiameter = windowHeight * 1.5;
  t = 0;
	
// assign the values to drop ranges
dropRanges = [
    [height - 80, height],    // for dropImg[0] metal
    [height - 300, height - 220],  // for dropImg[1] food
    [height - 110, height - 30],   // for dropImg[2] plastic
    [height - 210, height - 170],   // for dropImg[3] yard trimming
    [height - 210, height - 140],  // for dropImg[4] wood
    [height - 260, height - 220],  // for dropImg[5] paper
    [height - 260, height - 50],   // for dropImg[6] rubber
    [height - 80, height]     // for dropImg[7] glass
  ];

  // calculate the total diameter of all images
  let totalDiameter = 0;
  for (let i = 0; i < img.length; i++) {
    let diameter = maxDiameter * (proportions[i] / 100);
    totalDiameter += diameter;
  }

  // calculate the spacing between the images and make it global
  spacing = (width - totalDiameter) / (img.length + 1);

  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }

	// Create a random number of background images
  let numBgImages = random(10, 50);
  for (let i = 0; i < numBgImages; i++) {
    let imgIndex = floor(random(img.length));
    let size = random(80, 300);  // Smaller sizes for more density
    let opacity = random(20, 50);
    let x = random(width);
    let y = random(height / 3);  // Confine to upper third of the screen
    bgImages.push({
      img: img[imgIndex],
      size: size,
      opacity: opacity,
      x: x,
      y: y
    });
  }

}

function mousePressed() {
  // initialize x position
  let xPos = spacing;

  for (let i = 0; i < img.length; i++) {
    let diameter = maxDiameter * (proportions[order[i]] / 100);
    let yOffset = map(noise(t + i), 0, 1, -20, 20) + windowHeight * 0.02;
    let yPos = yOffset + diameter / 2;

    // check if the mouse is within the image
    if (dist(mouseX, mouseY, xPos + diameter / 2, yPos) < diameter / 2) {
      // add a new dropping image
      let dropSize = 50;
      let stopY = random(dropRanges[order[i]][0], dropRanges[order[i]][1]);  // new stopY property
		dropping.push({
        img: dropImg[order[i]],
        x: mouseX,
        y: mouseY,
        w: dropSize,
        h: dropSize,
        rotation: 0,  // initial rotation angle
        hSpeed: random(-2, 2),  // random horizontal speed
        vSpeed: 10,  // new vertical speed property
        noiseOffset: random(1000),  // offset for the noise function
        range: dropRanges[order[i]], // add this line
        rotationSpeed: random(-0.1, 0.1),  // random rotation speed and direction
          stopY: stopY  // store stopY in the object
      });
      break;
    }
    xPos += diameter + spacing;
  }
}







function draw() {
  background(235);

	
	// Draw the background images
  for (let bgImg of bgImages) {
    tint(255, bgImg.opacity);  // set the opacity of the image
    image(bgImg.img, bgImg.x, bgImg.y, bgImg.size, bgImg.size);
  }
  noTint();  // remove the tint for the rest of the images
	


  // calculate the total diameter of all images
  let totalDiameter = 0;
  for (let i = 0; i < img.length; i++) {
    let diameter = maxDiameter * (proportions[i] / 100);
    totalDiameter += diameter;
  }

  // calculate the spacing between the images
  let spacing = (width - totalDiameter) / (img.length + 1);

  let xPos = spacing;  // initialize x position

  for (let i = 0; i < img.length; i++) {
    let diameter = maxDiameter * (proportions[order[i]] / 100);
    let yOffset = map(noise(t + i), 0, 1, -20, 20) + windowHeight * 0.02;
    // calculate pulsing size
    let pulse = sin(frameCount * 0.02 + i) * (diameter * 0.1);  // adjust the multiplier for faster/slower pulsing and the factor for larger/smaller pulsing
	  
	  
	// draw the image at its position
	  image(img[order[i]], xPos + (diameter + pulse) / 2, (diameter + pulse) / 2 + yOffset, diameter + pulse, diameter + pulse);

    
    textSize(12);
    textAlign(CENTER, CENTER);
    let label = labels[order[i]];
    let labelWidth = textWidth(label);
    let labelHeight = textAscent() + textDescent();

// Draw black box
    fill(0);
	 noStroke();
    rect(xPos + (diameter + pulse) / 2 - labelWidth / 2, diameter + pulse + yOffset + 5, labelWidth, labelHeight);

    // Draw text
    fill(255);
    text(label, xPos + (diameter + pulse) / 2, diameter + pulse + yOffset + 5 + labelHeight / 2);

    xPos += (diameter + pulse) + spacing;  // update x position
  }

  let overImage = false;
  xPos = spacing;
  for (let i = 0; i < img.length; i++) {
    let diameter = maxDiameter * (proportions[order[i]] / 100);
    let yOffset = map(noise(t + i), 0, 1, -20, 20) + windowHeight * 0.02;
    if (dist(mouseX, mouseY, xPos + diameter / 2, yOffset + diameter / 2) < diameter / 2) {
      overImage = true;
      break;
    }
    xPos += diameter + spacing;
  }

  cursor(overImage ? HAND : ARROW);
	
	

//noise patterns at the bottom
	
function drawDottedPattern(yPos, dotDensity) {
  stroke(150); // Black color for dots
  strokeWeight(2.5); // Normal size dots
  for(let j = 0; j < width*height/dotDensity; j++) {
    let x = random(width);
    let y = random(yPos, height);
    point(x, y);
  }
}


// Draw decompose lines

let fillColors = [60, 80, 130, 160, 200, 220];

for (let i = 6; i >= 1; i--) {
  let dotDensity = map(i, 1, 6, 200, 1000); // map density from light (200) to heavy (1000)
  drawDottedPattern(height - i * 50, dotDensity);
	
	stroke(180); 
	strokeWeight(0.5); 

  fill(fillColors[i-1], 200*0.6); // fill color from array with alpha set to 60%
	
let overlap = 5; 

beginShape();
for(let x = 0; x <= width; x += 5) {
  let y = map(noise(i*10, x * 0.05, frameCount * 0.05), 0, 1, -10, 10); // Change these values to affect the noise
  vertex(x, height - i * 50 + y - overlap);
}
vertex(width, height + overlap);
vertex(0, height + overlap);
endShape(CLOSE);

}



// Draw decompose labels
fill(0); // Color of the text
noStroke();
textSize(12); // Size of the text
text("decompose in MILLENNIA", 100, height - 30 );
text("decompose in CENTURIES", 100, height - 85);
text("decompose in DECADES", 100, height - 135);
text("decompose in YEARS", 100, height - 185);
text("decompose in MONTHS", 100, height - 230);
text("decompose in WEEKS", 100, height - 280);
	
// Draw dropping images
for (let i = dropping.length - 1; i >= 0; i--) {
  let falling = dropping[i];

  // Check if the drop is within its range
  if (falling.y < falling.stopY) {  // change this line
    // increment y position
    falling.y += falling.vSpeed;  // increment y position based on the vertical speed
  }

  // increment x position based on horizontal speed and noise
  falling.x += map(noise(falling.noiseOffset), 0, 1, -2, 2) * falling.hSpeed;
  falling.noiseOffset += 0.01;  // increment noise offset

  // increment rotation angle
  falling.rotation += falling.rotationSpeed;  // adjust this value to change the rotation speed

  // draw the image with rotation
  push();
  translate(falling.x, falling.y);
  rotate(falling.rotation);
  image(falling.img, 0, 0, falling.w, falling.h);
  pop();
}



	
//refresh button
	button = createButton('clear out');
  button.position(10, height/2);
  button.mousePressed(refreshCanvas);

	// add spacing between letters
button.elt.style.letterSpacing = "1px";
}


function refreshCanvas() {
  dropping = [];
}
