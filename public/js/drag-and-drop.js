function setupDragAndDrop() {
  var containerElem = $(window);
  var targetElem = $('#dnd-target');
  var mouseDownStream  = Rx.Observable.fromEvent(targetElem, 'mousedown');
  var mouseUpStream    = Rx.Observable.fromEvent(targetElem, 'mouseup');

  var targetStartPos = targetElem.position();

  // 終了条件を表すストリーム
  var terminateDndStream = Rx.Observable.merge(
    mouseUpStream,
    Rx.Observable.fromEvent($(window), 'mouseup')
  );

  // D&D 終了時に元の位置へ戻す
  terminateDndStream.subscribe(function() {
    targetElem.animate(targetStartPos, 200, 'swing');
  });

  var targetPosStream = mouseDownStream
      .flatMap(function(downEv) {
        downEv.preventDefault();
        var mouseMoveStream = Rx.Observable.fromEvent(containerElem, 'mousemove');
        return mouseMoveStream.map(function(moveEv) {
          return {
            left: targetStartPos.left + (moveEv.pageX - downEv.pageX),
            top: targetStartPos.top + (moveEv.pageY - downEv.pageY),
          };
        }).takeUntil(terminateDndStream);
      });

  targetPosStream.subscribe(function(pos) {
    targetElem.css(pos);
  });
};

window.onload = setupDragAndDrop;
