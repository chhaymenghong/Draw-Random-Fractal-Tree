var w = 2000;
var h = 2000;
var plant;
var n = 0;
var totalDepth = 10;
var branchIndex = 0;
var colorH = 0;
var backgroundColor = [130, 212, 53, 255];
var strokeColor = [83, 49, 24, 255];
var intervalTimer;

function setup() {
  "// noprotect"
  createCanvas(w, h);
  translate(w / 2, h);
  stroke.apply(this, strokeColor);
  background.apply(this, backgroundColor);
  plant = new Plant();
  plant.grow();
  var num_branches = plant.branches.length;
  var drawAllAtOnce = true;
  plant.display(drawAllAtOnce);
  document.getElementById('btn').addEventListener('click', function() {
    if ( intervalTimer ) {
      clearInterval( intervalTimer );
    }
    background.apply( this, backgroundColor );
    plant = new Plant();
    plant.grow();
    plant.display(drawAllAtOnce);
    

  });
  document.getElementById('checkbox').addEventListener('change', function() {
    if ( intervalTimer ) {
      clearInterval( intervalTimer );
    }
    drawAllAtOnce = !drawAllAtOnce;

  });
}

/**
	Plant Class
**/
function Plant(listOfBranches) {
  var strokeWeight = 40,
    angle = 0;
  this.branches = [new Branch(null, createVector(0, 0), createVector(0, -400), strokeWeight, angle, -1)];
  this.startIndexOfBranchToGrowFrom = 0;
  this.numberOfBranchToGrowFrom = 1;
}

Plant.prototype.applyForce = function(angular) {
  for (var i = 0, len = this.branches.length; i < len; i++) {
    this.branches[i].applyForce(angular);
  }
}

Plant.prototype.grow = function() {
  var mainBranch;
  var leftBranch;
  var rightBranch;
  var middleBranch;

  for (var depth = 0; depth < totalDepth; depth++) {
    var len = this.numberOfBranchToGrowFrom;
    var currIndex = this.startIndexOfBranchToGrowFrom;
    while (len > 0) {
      mainBranch = this.branches[currIndex];

      // create left branch
      leftBranch = this.createBranch(mainBranch, -random(20, 50), random(0.6, 0.8), 0.7, depth);
      // create right branch
      rightBranch = this.createBranch(mainBranch, random(20, 50), random(0.6, 0.8), 0.7, depth);
      // create middle branch
      middleBranch = this.createBranch(mainBranch, random(-3, 3), random(0.5, 0.6), 0.5, depth);
      // add newly created branch
      Array.prototype.push.apply(this.branches, [leftBranch, rightBranch, middleBranch]);

      len--;
      currIndex++;
    }
    this.numberOfBranchToGrowFrom = this.numberOfBranchToGrowFrom * 3;
    this.startIndexOfBranchToGrowFrom = this.startIndexOfBranchToGrowFrom * 3 + 1;
  }
}

Plant.prototype.display = function(drawAllAtOnce) {
  var len = this.branches.length;
  if (drawAllAtOnce) {
    for (var i = 0; i < len; i++) {
      this.branches[i].display();
    }
  } else {
    var start = 0;
    intervalTimer = setInterval(function() {
      if (start < len) {
        this.plant.branches[start++].display();
      }
    }, 0.5);
  }
}


Plant.prototype.createBranch = function(mainBranch, angle, branchLen, strokeRatio, depth) {
  var endPos = mainBranch.startPos.copy();
  var ba = p5.Vector.sub(mainBranch.endPos, mainBranch.startPos);
  endPos.add(ba);

  ba.rotate(radians(angle)).mult(branchLen);
  endPos.add(ba);
  return new Branch(mainBranch, mainBranch.endPos.copy(), endPos, mainBranch.strokeWeight * strokeRatio, angle, branchLen, depth);

}


/**
	Branch Class
**/
function Branch(parentBranch, startPos, endPos, strokeWeight, angle, len, depth) {
  this.parentBranch = parentBranch;
  // = parentBranch.endPos
  this.startPos = startPos;
  this.endPos = endPos;
  this.strokeWeight = strokeWeight;
  this.angle = angle;
  this.branchLen = len;
  this.windOffsetAngle = 0;
  this.leaf = null;
  if (depth === totalDepth - 1 && random() < 0.01) {
    this.leaf = new Leaf(this);
  }
}

Branch.prototype.display = function() {
  strokeWeight(this.strokeWeight);
  stroke(83, 49, 24, 255);
  line(this.startPos.x, this.startPos.y, this.endPos.x, this.endPos.y);
  if (this.leaf !== null) {
    // this.leaf.display();
  }
}

Branch.prototype.applyForce = function(windOffsetAngle) {
  this.windOffsetAngle = windOffsetAngle;
}


/**
Leaf Class
**/
function Leaf(branch) {
  this.branch = branch;
  this.leafStroke = [0, 0, 0, 100];
  this.fillColor = [255, 102, 0, 255];
}

Leaf.prototype.display = function() {
  var branch = this.branch;
  fill.apply(this, this.fillColor);
  strokeWeight(1);
  stroke.apply(this, this.leafStroke);
  line(branch.endPos.x, branch.endPos.y, branch.endPos.x, branch.endPos.y + 30);
  ellipse(branch.endPos.x, branch.endPos.y + 30, 5, 10);
}


function draw() {
  translate(w / 2, h);
}