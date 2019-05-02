let mode;
let modes = [{
    name: "RYB",
    val: [0, 255]
  }, {
    name: "RGB",
    val: [255, 0]
  },
  {
    name: "CMYK",
    val: [0, 255]
  }
];
let centerRed = [150, 150]
let centerGreen = [250, 150]
let centerBlue = [200, 237]
let radius = 100;

function setup() {
  createCanvas(400, 400)
  noLoop();
  createP("Parameters")
  sel = createSelect();
  for (let i = 0; i < modes.length; i++) {
    sel.option(modes[i].name)
  }
  sel.changed(redraw)
}

function draw() {
  loadPixels();
  let i = 0;
  mode = modes.find(f => f.name == sel.value())
  let red, yel, blu;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (mode.name == "RYB") {
        red = (dist(x, y, centerRed[0], centerRed[1]) < radius ? [255 * 0, 255 * 1, 255 * 1] : [0, 0, 0]);
        yel = (dist(x, y, centerGreen[0], centerGreen[1]) < radius ? [255 * 0, 255 * -.75, 255 * 1.5] : [0, 0, 0]);
        blu = (dist(x, y, centerBlue[0], centerBlue[1]) < radius ? [255 * 2, 255 * 1, 255 * -.5] : [0, 0, 0]);
        pixels[i] = 255 - (red[0] + yel[0] + blu[0]);
        pixels[i + 1] = 255 - (red[1] + yel[1] + blu[1]);
        pixels[i + 2] = 255 - (red[2] + yel[2] + blu[2]);
        pixels[i + 3] = 255;

        i += 4;
      } else {
        pixels[i] = (dist(x, y, centerRed[0], centerRed[1]) < radius ? mode.val[0] : mode.val[1]);
        pixels[i + 1] = (dist(x, y, centerGreen[0], centerGreen[1]) < radius ? mode.val[0] : mode.val[1]);
        pixels[i + 2] = (dist(x, y, centerBlue[0], centerBlue[1]) < radius ? mode.val[0] : mode.val[1]);
        pixels[i + 3] = 255;
        i += 4;
      }
    }
  }
  updatePixels();
}

function cosMap(val, start1, stop1, start2, stop2) {
  cosVal = map(val, start1, stop1, HALF_PI, 0, true)
  return map(cos(cosVal), 0, 1, start2, stop2, true)
}

function ryb2rgb(r, y, b, rgb) { // from https://math.stackexchange.com/questions/305395/ryb-and-rgb-color-space-conversion
  // rgb 0=red, 1=green, 2=blue
  white = [1, 1, 1]
  red = [1, 0, 0]
  yellow = [1, 1, 0]
  blue = [0.163, 0.373, 0.6]
  violet = [0.5, 0, 0.5]
  green = [0, 0.66, 0.2]
  orange = [1, 0.5, 0]
  black = [0.2, 0.094, 0.0]
  return white[rgb] * (1 - r) * (1 - b) * (1 - y) +
    red[rgb] * r * (1 - b) * (1 - y) +
    blue[rgb] * (1 - r) * b * (1 - y) +
    violet[rgb] * r * b * (1 - y) +
    yellow[rgb] * (1 - r) * (1 - b) * y +
    orange[rgb] * r * (1 - b) * y +
    green[rgb] * (1 - r) * b * y +
    black[rgb] * r * b * y;
}

function rgb2ryb(r, g, b, ryb) {
  // ryb 0=red, 1=yellow, 2=blue
  black = [1, 1, 1]
  red = [1, 0, 0]
  green = [0, 1, .483]
  yellow = [0, 1, 0]
  blue = [0, 0, 1]
  magenta = [.309, 0, .469]
  turquoise = [0, .053, .210]
  white = [0, 0, 0]
  return black[ryb] * (1 - r) * (1 - b) * (1 - g) +
    red[ryb] * r * (1 - b) * (1 - g) +
    green[ryb] * (1 - r) * b * (1 - g) +
    yellow[ryb] * r * b * (1 - g) +
    blue[ryb] * (1 - r) * (1 - b) * g +
    magenta[ryb] * r * (1 - b) * g +
    turquoise[ryb] * (1 - r) * b * g +
    white[ryb] * r * b * g;
}

let selectedCircle = [];
let memMouse = [];

function mousePressed() {
  if (selectedCircle.length == 0) {
    memMouse = [mouseX, mouseY]
    if (dist(mouseX, mouseY, centerRed[0], centerRed[1]) < radius) {
      selectedCircle = ["red", centerRed[0], centerRed[1]];
    } else if (dist(mouseX, mouseY, centerGreen[0], centerGreen[1]) < radius) {
      selectedCircle = ["green", centerGreen[0], centerGreen[1]];
    } else if (dist(mouseX, mouseY, centerBlue[0], centerBlue[1]) < radius) {
      selectedCircle = ["blue", centerBlue[0], centerBlue[1]];
    }
  }
}

function mouseReleased() {
  if (selectedCircle[0] == "red") {
    selectedCircle = [];
    centerRed[0] += mouseX - memMouse[0];
    centerRed[1] += mouseY - memMouse[1];
  } else if (selectedCircle[0] == "green") {
    selectedCircle = [];
    centerGreen[0] += mouseX - memMouse[0];
    centerGreen[1] += mouseY - memMouse[1];
  } else if (selectedCircle[0] == "blue") {
    selectedCircle = [];
    centerBlue[0] += mouseX - memMouse[0];
    centerBlue[1] += mouseY - memMouse[1];
  }
  draw()
}

class colorCircle {
  constructor(col, x, y, rad) {
    this.col = col;

  }
}