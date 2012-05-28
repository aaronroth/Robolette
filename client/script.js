// Copyright (c) 2012 Aaron Roth
// See the file license.txt for copying permission.
//

// ------------------ Globals ------------------ //

// Canvas.
var canvasX = 250;
var canvasY = 250;

// Wheel positioning.
var arc = Math.PI / 18.5;
var context;
var insideRadius = 175;
var outsideRadius = 200;
var startAngle = -89.6;
var textRadius = 184;

// Wheel style and content.
var black = '#000000';
var fontStyle = 'bold 12px sans-serif';
var green = '#006600';
var lineWidth = 2;
var red = '#ff0000';
var white = '#ffffff';
var numbers = ['0', '32', '15', '19', '4', '21', '2', '25', '17', '34', '6',
               '27', '13', '36', '11', '30', '8', '23', '10', '5', '24', '16',
               '33', '1', '20', '14', '31', '9', '22', '18', '29', '7', '28',
               '12', '35', '3', '26'];

// Wheel spinning.
var spinAngle = 0;
var spinAngleStart = 10;
var spinTime = 0;
var spinTimeout = null;
var spinTimeTotal = 0;

// --------------------------------------------- //

$(document).ready(function() {
  $('#start-button').click(start_game);
  $('#spin-button').click(spin);
});

function draw_wheel() {
  var canvas = document.getElementById('wheel');
  
  // Make sure the browser supports canvas.
  if (canvas.getContext) {
    context = canvas.getContext('2d');
    context.clearRect(0, 0, 500, 500);
    
    // Set wheel styles.
    context.strokeStyle = black;
    context.lineWidth = lineWidth;
    context.font = fontStyle;
    
    // Draw entire wheel.
    for (var i = 0; i < 37; i++) {
      var angle = startAngle + i * arc;
      
      // Set colors.
      if (i == 0) {
        context.fillStyle = green;
      } else if (i % 2 != 0) {
        context.fillStyle = red;
      } else {
        context.fillStyle = black;
      }
      
      // Draw wheel.
      context.beginPath();
      context.arc(canvasX, canvasY, outsideRadius, angle, angle + arc, false);
      context.arc(canvasX, canvasY, insideRadius, angle + arc, angle, true);
      context.stroke();
      context.fill();
      context.save();
      
      // Draw numbers on the wheel.
      var text = numbers[i];
      var transX = canvasX + Math.cos(angle + arc / 2) * textRadius;
      var transY = canvasY + Math.sin(angle + arc / 2) * textRadius;
      var rotateVal = angle + arc / 2 + Math.PI / 2;
      
      context.translate(transX, transY);
      context.rotate(rotateVal);
      context.fillStyle = white;
      context.fillText(text, -context.measureText(text).width / 2, 0);
      context.restore();
    }
    
    // Draw arrow.
    context.fillStyle = white;
    context.beginPath();
    context.moveTo(250 - 0, 250 - (outsideRadius + 5));
    context.lineTo(250 + 0, 250 - (outsideRadius + 5));
    context.lineTo(250 + 0, 250 - (outsideRadius - 5));
    context.lineTo(250 + 9, 250 - (outsideRadius - 5));
    context.lineTo(250 + 0, 250 - (outsideRadius - 13));
    context.lineTo(250 - 9, 250 - (outsideRadius - 5));
    context.lineTo(250 - 0, 250 - (outsideRadius - 5));
    context.lineTo(250 - 0, 250 - (outsideRadius + 5));
    context.fill();
  } else {
    alert('Your browser does not support this game! ' +
          'Try Safari, Chrome, Firefox, or Opera.');
  }
}

function ease_out(t, b, c, d) {
  var ts = (t /= d) * t;
  var tc = ts * t;
  
  return b + c * (tc + -3 * ts + 3 * t);
}

function rotate_wheel() {
  spinTime += 30;
  
  if (spinTime >= spinTimeTotal) {
    stop_wheel();
  } else {
    spinAngle = spinAngleStart -
                ease_out(spinTime, 0, spinAngleStart, spinTimeTotal);
    
    startAngle += spinAngle * Math.PI / 180;
    draw_wheel();
    spinTimeout = setTimeout('rotate_wheel()', 30);
  }
}

function spin() {
  spinAngleStart = Math.random() * 10 + 10;
  spinTime = 0;
  spinTimeTotal = (Math.random() * 10 + 2) * 1000;
  rotate_wheel();
}

function start_game() {
  var startBank = $('#starting-bank').val();
  var minBet = $('#min-bet').val();
  var maxBet = $('#max-bet').val();
  
  $('#form').fadeOut(100, 'linear', function() {
    $('#form').remove();
  });
  $('#title').fadeOut(100, 'linear', function() {
    $('#title').remove();
  });
  
  $('#game-board').fadeIn(100, 'linear');
  draw_wheel();
}

function stop_wheel() {
  clearTimeout(spinTimeout);
  
  var degrees = startAngle * (-1) * 180 / Math.PI + 90;
  var arcDegrees = arc * 180 / Math.PI;
  var index = Math.floor((360 - degrees % 360) / arcDegrees);
  context.save();
  var winningNumber = numbers[index];
}