let img = [];
let dropImg = [];  // new array for the dropping images
let dropping = [];  // array to hold the properties of any currently dropping images
let bgImage;
let order = [0, 1, 2, 3, 4, 5, 6, 7];
let labels = ["rubber+leather+textiles 8.96%","glass 4.19%","plastics 12.20%","food 21.59%","metals 8.76%","paper+paperboard 23.05%","wood 6.19%","yard trimmings 12.11%"];
let proportions = [8.9, 4.2, 12.2, 21.6, 8.8, 23.1, 6.2, 12.1];
let yPositions = [8, 1, 2, 4, 10, 6, 3, 6]; // in percentage
let margin = 0.05;
let spacing = 10;

let dropRanges;
let button;
let totalDiameter = 0;

let totalProportions = 0;  // Calculate it once in setup()
let imagesProperties = []; // Store each image's properties

function preload() {
	bgImage = loadImage("https://i.imgur.com/nxU2pLl.png"); // Load the background image
  img[0] = loadImage("https://i.imgur.com/ncIC6T1.png");//rubber
  img[1] = loadImage("https://i.imgur.com/vSU4DBR.png");//glass
  img[2] = loadImage("https://i.imgur.com/uhBrKBq.png");//plastics
  img[3] = loadImage("https://i.imgur.com/pJNiHxe.png");//food
  img[4] = loadImage("https://i.imgur.com/LIbHtI1.png");//metal
  img[5] = loadImage("https://i.imgur.com/12xZRub.png");//paper
  img[6] = loadImage("https://i.imgur.com/7QKxS5c.png");//wood
  img[7] = loadImage("https://i.imgur.com/otWWi5W.png");//yardtrim

 // preload the dropping images
  dropImg[0] = loadImage("https://i.imgur.com/6wHJV69.png"); //rubber leather textile  
  dropImg[1] = loadImage("https://i.imgur.com/JXjpKVh.png"); //glass	  
  dropImg[2] = loadImage("https://i.imgur.com/ttQaN5h.png"); //plastic
  dropImg[3] = loadImage("https://i.imgur.com/qzRvm6z.png"); //food
  dropImg[4] = loadImage("https://i.imgur.com/RDD8aUY.png"); //metal
  dropImg[5] = loadImage("https://i.imgur.com/fyiQjcL.png"); //paper
  dropImg[6] = loadImage("https://i.imgur.com/ZQLiSVj.png"); //wood
  dropImg[7] = loadImage("https://i.imgur.com/XgFFjBj.png"); //yard trimming
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0); // Position the canvas at the top-left corner of the window
  imageMode(CORNER);
  maxDiameter = windowHeight * 1.5;
  t = 0;
	
// assign the values to drop ranges
dropRanges = [
    [height - 260, height - 50],    // for dropImg[0] rubber
    [height - 80, height] ,  // for dropImg[1] glass
    [height - 110, height - 30],   // for dropImg[2] plastic
    [height - 300, height - 220],   // for dropImg[3] food
    [height - 80, height],  // for dropImg[4] metal
    [height - 260, height - 220],  // for dropImg[5] paper
    [height - 210, height - 140],   // for dropImg[6] wood
    [height - 210, height - 170]    // for dropImg[7] yardtrimming
  ];

	
// clear button
button = createButton('clear out');
button.position(10, height/2);
button.mousePressed(refreshCanvas);
button.elt.style.letterSpacing = "1px";  // add spacing between letters
	
	// calculate total of proportions
  totalProportions = proportions.reduce((a, b) => a + b, 0);

  let xpos = windowWidth * margin; // start at left margin
  let contentWidth = windowWidth * (1 - 2 * margin); // adjust for margins

  // calculate and store image properties
for (let i = 0; i < img.length; i++) {
    let newWidth = contentWidth * proportions[i] / totalProportions;
    let newHeight = img[i].height * (newWidth / img[i].width);
    let ypos = windowHeight * yPositions[i] / 100;  // calculate ypos as a percentage of window height
    imagesProperties.push({x: xpos, y: ypos, origWidth: newWidth, origHeight: newHeight, width: newWidth, height: newHeight});
    xpos += newWidth;
}
}

function refreshCanvas() {
  dropping = [];
}

function draw() {
  background(235);

  let windowAspect = windowWidth / windowHeight;
  let imgAspect = bgImage.width / bgImage.height;

  if (imgAspect > windowAspect) {
    // Image is wider than window - scale to fit window width
    let newHeight = windowWidth / imgAspect;
    image(bgImage, 0, 0, windowWidth, newHeight);
  } else {
    // Image is taller than window - scale to fit window height
    let newWidth = windowHeight * imgAspect;
    image(bgImage, 0, 0, newWidth, windowHeight);
  }
	
//pulsing effects of the main images
for (let i = 0; i < img.length; i++) {
  let imageProp = imagesProperties[i];
  let newWidth = imageProp.origWidth + imageProp.origWidth * 0.12 * sin(frameCount * 0.1);
  let newHeight = imageProp.origHeight + imageProp.origHeight * 0.12 * sin(frameCount * 0.1);
  imageProp.width = newWidth;
  imageProp.height = newHeight;
}
// Draw the main images
 for (let i = 0; i < img.length; i++) {
    let imageProp = imagesProperties[i];
    image(img[i], imageProp.x, imageProp.y, imageProp.width, imageProp.height);
	// Add labels
    
    // Add labels
  textSize(12);
  let label = labels[i];
  let labelWidth = textWidth(label) + 2; // Add padding to the label width
  let labelHeight = 12; // Fixed label height
  
  let labelBoxX = imageProp.x + (imageProp.width - labelWidth) / 2; // Center the box horizontally
  let labelBoxY = imageProp.y + imageProp.height; // Position the box below the image
  
  fill(0);
  rect(labelBoxX, labelBoxY, labelWidth, labelHeight);
  
  textAlign(CENTER, CENTER);
  fill(255);
  text(label, labelBoxX + labelWidth / 2, labelBoxY + labelHeight / 2);
  
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
	
cursor(overImage ? HAND : ARROW);

  t += 0.01;

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
}
function mousePressed() {
  for (let i = 0; i < img.length; i++) {
    let imageProp = imagesProperties[i];
    
    if (mouseX > imageProp.x && mouseX < imageProp.x + imageProp.width && mouseY > imageProp.y && mouseY < imageProp.y + imageProp.height) {
      let dropSize = 50;
      let stopY = random(dropRanges[i][0], dropRanges[i][1]);
      dropping.push({
        img: dropImg[i],
        x: mouseX,
        y: mouseY,
        w: dropSize,
        h: dropSize,
        rotation: 0,
        hSpeed: random(-2, 2),
        vSpeed: 10,
        noiseOffset: random(1000),
        range: dropRanges[i],
        rotationSpeed: random(-0.1, 0.1),
        stopY: stopY
      });
      break;
    }
  }
}
