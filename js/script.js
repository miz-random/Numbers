var g, selectorFn, deselectorFn,
    WINNER = "You are the champion, my friend!",
    RANDOM_MODE = false,
    keys = [];

// Main script

window.addEventListener("keydown", keysPressed, false);
window.addEventListener("keyup", keysReleased, false);

$(window).ready(function () {
  start();
});

// Starts the game
function start () {
  var selectedCell = false,
      
      select = function (node) {
        node.addClass('selected');
        selectedCell = node;
      },

      deselect = function (node) {
        node.removeClass('selected');
        selectedCell = false; 
      };

  // Handles selecting & matching the cells
  selectorFn = function(event) {
    var node = $(event.target),
        matched;

    // Deselects if a selected cell is clicked
    if (node.is('.selected')) { deselect(node); }
    
    else {
      if (node.text() !== '') {      // we only select non-empty cells
        if (!selectedCell) { select(node); }

        // matches when the second cell is selected
        else {
          matched = g.matchCells(selectedCell.attr('id'), node.attr('id')); 
          deselect(selectedCell);

          if (matched) { paint(); }
          else { select(node); }
        }
      } 
    }
  };
  
  // Handles deselecting the cell when user clicks outside the game field
  deselectorFn = function(event) {
    if (!$(event.target).is('.cell')) { deselect($('.selected')); }
  };
  
  g = new GameField(RANDOM_MODE);

  $(window).scrollTop(0);
  paint();
};
 
// Handles the pressed keys
function keysPressed (k) {
  keys[k.keyCode] = true;
     
  // R
  if (keys[82]) {
    start();
  }
     
  // C
  if (keys[67]) {
    cancel();
  }

  // A
  if (keys[65]) {
    addMore();
  }
};

// Handles releasing the keys
function keysReleased (k) {
    keys[k.keyCode] = false;
};

// Adds more numbers when no more moves possible
function addMore () {
  if (!g.isWon()) {
    g.addMore();
    paint();
  }
};

// Cancels the last move
function cancel () {
  if (!g.isWon()) {
    g.restore();
    paint();
  }
};

// Sets the game mode to random
function randomMode () {
  RANDOM_MODE = !RANDOM_MODE;
  start();
}

// Adds field contents to the page in a proper manner
function paint () {
  var number, buttonText;

  $("#gameField").empty();

  if (!g.isWon()) {

    // Shouldn't this be private?
    for (i in g.rows) {
      r = '<div class = "row">' + '<div class = "rowNumber">' + i + '</div>';
      for (j in g.rows[i].cells) {
        number = g.rows[i].cells[j].number;
        r += '<div id="' + i + ':' + j +'" class = "cell' + (number === 0 ? ' removed">' : '">' + number) + '</div>';
      }
      r += '</div>';
      $("#gameField").append(r);
    }
  
    $('.cell').click(selectorFn);
    $(document).click(deselectorFn);

    buttonText = "Random: " + (RANDOM_MODE ? "on" : "off");
    $('#random').text(buttonText);
  }

  else {
    $("#gameField").append(WINNER);
  }
};