import FOOD_CHAIN from '../food_chain'

var lastDir;

class CellsContactService{
    check(diff, cells, width, cellToMove, direction) {
      var i = cells.indexOf(cellToMove);
      width = +width;
      var cellToCheck;
      if(direction == 0 && i>=width) cellToCheck = cells[i-width] ;
      if(direction == 1 && (i+1)%width!=0) cellToCheck = cells[i+1] ;
      if(direction == 2 && (i+width)<cells.length) cellToCheck = cells[i+width] ;
      if(direction == 3 && i%width!=0) cellToCheck = cells[i-1] ;

      if(cellToCheck && cellToCheck.fighter == FOOD_CHAIN[diff][cellToMove.fighter]) 
        return cellToCheck;

      return null;
    }

    getLastDirection(){
      return lastDir;
    }

    setLastDirection(l){
      console.log("setLastDirection",l)
       lastDir = l;
    }
}

module.exports = new CellsContactService;