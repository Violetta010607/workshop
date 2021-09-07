
let video;
let width = 720;
let height = 480;

let playButton;
let stopButton;
var videoAvailable = false;

var detector;
var posit;
var markers;
var currentImage;
var ismarked = false;

var rectWitdh = 0;
var centrex = 0;
var centrey = 0;


function preload() {
  soundFormats('mp3');
  soundA = loadSound('assets/js/sounds/a.mp3');
  soundA.setLoop(true);
}

function videoReady() {
  console.log('Video is ready!!!');
  videoAvailable = true;
  detector = new AR.Detector({
    dictionaryName: 'ARUCO_MIP_36h12'
  });
  console.log(detector);
}


function setup() {
  createCanvas(width, height+50);
  background(51);
  video = createCapture(VIDEO, videoReady);
  video.size(width, height);
  video.hide();
  background(0);

  playButton = createButton('play');
  playButton.mousePressed(playSound);

  stopButton = createButton('stop');
  stopButton.mousePressed(stopSound);
}

function playSound(){
  if(!soundA.isPlaying()){
    soundA.setVolume(0.5);
    soundA.play();
  }
}

function stopSound(){
  if(soundA.isPlaying()){
    soundA.stop();
  }
}

function drawCorners(markers){
  var corners, corner, i, j;

  for (i = 0; i !== markers.length; ++ i){
    corners = markers[i].corners;

    stroke(0, 255, 0);
    strokeWeight(1);
    noFill();

    for (j = 0; j !== corners.length; ++ j){
      corner = corners[j];
      let x0 = corner.x;
      let y0 = corner.y;
      corner = corners[(j + 1) % corners.length];
      line(x0, y0, corner.x, corner.y);
    }

  }
}

function drawId(markers){
  var corners, corner, x, y, i, j;

  stroke(255, 0 ,0);
  textSize(10)
  noFill();

  for (i = 0; i !== markers.length; ++ i){
    corners = markers[i].corners;

    xMin = Infinity;
    yMin = Infinity;

    xMax = 0;
    yMax = 0;

    for (j = 0; j !== corners.length; ++ j){
      corner = corners[j];

      xMin = Math.min(xMin, corner.x);
      yMin = Math.min(yMin, corner.y);

      xMax = Math.max(xMax, corner.x);
      yMax = Math.max(yMax, corner.y);
    }

    centrex = (xMin + xMax)/2;
    centrey = (yMin + yMax)/2;
    console.log(centrex+" "+centrey);
    strokeWeight(1);
    point(centrex, centrey);

    text(markers[i].id, xMin, yMin);
  }
}

function changeVolume(){
  var newVolume = norm(centrex, 0, width);
  newVolume = Math.round(newVolume * 10) / 10
  console.log(newVolume);
  soundA.setVolume(newVolume);
  stroke(255, 255 ,255);
  textSize(20)
  text(soundA.getVolume(), 10, height+25);
}


// function detection(currentImage){
//   markers = detector.detectImage(320, 240, currentImage.pixels);
//   console.log(markers);
//   if(markers.length > 0){
//     ismarked = true;
//   }
// }

function draw() {
  if(videoAvailable){
    currentImage = video.get();
    currentImage.loadPixels();
    console.log(currentImage);
    image(currentImage, 0, 0);
    markers = detector.detectImage(width, height, currentImage.pixels);
    console.log(markers);
    if(markers.length > 0){
      ismarked = true;
    }
  }

  if(ismarked){
    drawCorners(markers);
    drawId(markers);
    changeVolume();
    ismarked = false;
  }
  //background(0);
  //image(video, 0, 0, 320, 240);
  //fill(255);
  //textSize(16);

  // text(value, 10, height - 10);

}
