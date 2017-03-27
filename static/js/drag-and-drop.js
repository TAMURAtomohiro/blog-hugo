function setupDragAndDrop() {
  var containerElem = $('body');
  var targetElem = $('#dnd-target');
  var mouseDownStream  = Rx.Observable.fromEvent(targetElem, 'mousedown');
  var mouseUpStream    = Rx.Observable.fromEvent(targetElem, 'mouseup');

  var targetStartPos = targetElem.position();
  var mouseEnterStream = Rx.Observable.fromEvent(targetElem, 'mouseenter');
  var mouseLeaveStream = Rx.Observable.fromEvent(targetElem, 'mouseleave');
  // 終了条件を表すストリーム
  var terminateDndStream = new Rx.Subject();
  mouseUpStream.subscribe(function(upEv) { terminateDndStream.next(upEv); });
  // mouseLeaveStream.subscribe(function() {terminateDndStream.next(null);});
  Rx.Observable.fromEvent(containerElem, 'mouseleave').subscribe(function() {terminateDndStream.next(null);});
  // mouseEnterStream.merge(mouseLeaveStream)
  //   .debounceTime(200)
  //   .filter(function(ev) { return ev.type === 'mouseout'; })
  //   .subscribe(function() { terminateDndStream.next(null); });

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
