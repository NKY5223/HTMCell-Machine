const sys = new CellMachine(25, 25, 32, );


sys.addCell(Mover, 0, 1, 0);
sys.addCell(Rotator, 12, 1, 0);
sys.addCell(Rotator_CCW, 10, 20, 0);

setTimeout(sys.gameLoop.bind(sys), 0);