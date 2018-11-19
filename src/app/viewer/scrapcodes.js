canvas.on('mouse:down', function(o){
    isDown = true;
    canvas.clear();
    var pointer = canvas.getPointer(o.e);
    var points = [ pointer.x, pointer.y, pointer.x, pointer.y ];
    line = new fabric.Line(points, {
      strokeWidth: 1,
      fill: 'black',
      stroke: 'black',
      originX: 'center',
      originY: 'center'
    });
    canvas.add(line);
  });
  
canvas.on('mouse:move', function(o){
    if (!isDown) return;
    var pointer = canvas.getPointer(o.e);
    line.set({ x2: pointer.x, y2: pointer.y });
    canvas.renderAll();
});
  
canvas.on('mouse:up', function(o){
    isDown = false;
});
//set canvas size to viewport size
// function sizeCanvas()
// {
//   var width  = Math.max(document.documentElement.clientWidth,  window.innerWidth  || 0);
//   var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
//   canvas.setHeight( height )
//   canvas.setWidth( width )
//     $('.canvas-container').css('position','fixed');
//     $('.canvas-container').css('opacity','1');
//     $('.canvas-container').css('backgroud-color','rgba(255, 255, 255, 0)');
//     $('.canvas-container').css('top','0');
//     $('.canvas-container').css('left','0');
 
// }
// sizeCanvas();
// window.addEventListener('resize', draw, false);

// function draw()
// {  
//   canvas.renderAll();
// }