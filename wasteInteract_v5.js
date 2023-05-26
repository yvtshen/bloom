let img = [];
let dropImg = [];  
let dropping = [];  // array to hold the properties of any currently dropping images
let bgImage;
let order = [0, 1, 2, 3, 4, 5, 6, 7];
let labels = ["rubber+leather+textiles: 8.96%","glass: 4.19%","plastics: 12.20%","food: 21.59%","metals: 8.76%","paper+paperboard: 23.05%","wood: 6.19%","yard trimmings: 12.11%"];
let proportions = [8.9, 4.2, 12.2, 21.6, 8.8, 23.1, 6.2, 12.1];
let yPositions = [12, 1.5, 2, 4, 10, 6, 3, 6]; // in percentage
let margin = 0.05;
let spacing = 10;
let dropRanges;
let button;
let totalDiameter = 0;
let totalProportions = 0;  
let imagesProperties = []; 
let snowflakes = []; 

function preload() {
bgImage = loadImage("https://i.imgur.com/39zyruG.png"); // Load the background image
	
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
  dropImg[3] = loadImage("https://i.imgur.com/INIeGdD.png"); //food
  dropImg[4] = loadImage("https://i.imgur.com/RDD8aUY.png"); //metal
  dropImg[5] = loadImage("https://i.imgur.com/fyiQjcL.png"); //paper
  dropImg[6] = loadImage("https://i.imgur.com/ZQLiSVj.png"); //wood
  dropImg[7] = loadImage("https://i.imgur.com/XgFFjBj.png"); //yard trimming
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0); // Position the canvas at the top-left corner of the window
  maxDiameter = windowHeight * 1.5;
  t = 0;
	
// assign the values to drop ranges
dropRanges = [
    [height - 260, height - 50],    // for dropImg[0] rubber
    [height - 80, height] ,  		// for dropImg[1] glass
    [height - 110, height - 30],   // for dropImg[2] plastic
    [height - 300, height - 220],   // for dropImg[3] food
    [height - 80, height],  		// for dropImg[4] metal
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
	
	imageMode(CORNER);
	
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
imageMode(CENTER);
for (let i = 0; i < img.length; i++) {
  let imageProp = imagesProperties[i];
  let scaleFactor = 0.3 + 0.4 * (1 + sin(frameCount * 0.015));
	

  let newWidth = imageProp.origWidth * scaleFactor;
  let newHeight = imageProp.origHeight * scaleFactor;
	
   let centerX = imageProp.x + imageProp.origWidth / 2;
   let centerY = imageProp.y + imageProp.origHeight / 2;
  
  imageProp.width = newWidth;
  imageProp.height = newHeight;

     
       
}
	imageMode(CORNER);
	
// Draw the main images
 for (let i = 0; i < img.length; i++) {
    let imageProp = imagesProperties[i];
    image(img[i], imageProp.x, imageProp.y, imageProp.width, imageProp.height);
	 
	// Calculate the distance from the mouse to the center of the image
    let distance = dist(mouseX, mouseY, imageProp.x + imageProp.width / 2, imageProp.y + imageProp.height / 2);
	
// If the mouse is over the image, show the label
    if (distance < imageProp.width / 2) {
      textSize(14);
      let label = labels[i];
      let labelWidth = textWidth(label) + 2; // Add padding to the label width
      let labelHeight = 14; // Fixed label height
      
      let labelBoxX = imageProp.x + (imageProp.width - labelWidth) / 2; // Center the box horizontally
      let labelBoxY = imageProp.y + imageProp.height; // Position the box below the image
      
      fill(0);
      rect(labelBoxX, labelBoxY, labelWidth, labelHeight);
      
      textAlign(CENTER, CENTER);
      fill(255);
      text(label, labelBoxX + labelWidth / 2, labelBoxY + labelHeight / 2);
    }
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
	

// Draw decompose lines

let fillColors = [60, 80, 130, 160, 200, 220];

for (let i = 6; i >= 1; i--) {

	stroke(180); 
	strokeWeight(0.5); 

  	fill(fillColors[i-1], 200*0.6); // fill color from array with alpha set to 60%
	
	let overlap = 5; 

	beginShape();
	for(let x = 0; x <= width; x += 5) {
  		let y = map(noise(i*10, x * 0.05, frameCount * 0.01), 0, 1, -15, 0.5); // Change these values to affect the noise
		vertex(x, height - i * 50 + y - overlap);
	}
vertex(width, height + overlap);
vertex(0, height + overlap);
endShape(CLOSE);
	
	 for (let j = 0; j < random(5); j++) {
      snowflakes.push(new snowflake(height - i * 50 - 10 - overlap, height - (i-1) * 50 + 10 - overlap)); // append snowflake object
    }
  }
	// Loop through snowflakes with a for..of loop
  for (let flake of snowflakes) {
    flake.update(); // update snowflake position
    flake.display(); // draw snowflake
  }



// Draw decompose labels
fill(0); // Color of the text
noStroke();
textSize(14);
textAlign(RIGHT); // Align text to the right


let rightEdge = width - 30; // change the right alignment of the text

text("decompose in M I L L E N N I A", rightEdge, height - 30 );
text("decompose in C E N T U R I E S", rightEdge, height - 85);
text("decompose in D E C A D E S", rightEdge, height - 135);
text("decompose in Y E A R S", rightEdge, height - 185);
text("decompose in M O N T H S", rightEdge, height - 230);
text("decompose in W E E K S", rightEdge, height - 280);

	
cursor(overImage ? HAND : ARROW);

  t += 0.01;

	// Draw dropping images
for (let i = dropping.length - 1; i >= 0; i--) {
  let falling = dropping[i];

  // Check if the drop is within its range
  if (falling.y < falling.stopY) {  
       falling.y += falling.vSpeed;  // increment y position based on the vertical speed
  }


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

// snowflake class
function snowflake(yMin, yMax) {
  // initialize coordinates within a given range
  this.posX = random(width);
  this.posY = random(yMin, yMax);
  this.initialangle = random(0, 2 * PI);
  this.size = random(1, 4);
  this.yMax = yMax;

  // radius of snowflake spiral
  this.radius = sqrt(random(pow(width / 2, 2)));

  this.update = function() {
    // Update y position
    this.posY += pow(this.size, 0.05);//falling speed

    // Delete snowflake if past end of its section
    if (this.posY > this.yMax) {
      let index = snowflakes.indexOf(this);
      snowflakes.splice(index, 1);
    }
  };

  this.display = function() {
    ellipse(this.posX, this.posY, this.size);
  };
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
        hSpeed: random(-1, 1),
        vSpeed: 5,
        range: dropRanges[i],
        rotationSpeed: random(-0.02, 0.02),
        stopY: stopY
      });
      break;
    }
  }
}
