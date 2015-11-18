tau.mashups
    .addDependency('Underscore')
    .addDependency('jQuery')
    .addModule('WorkflowImageStreamlinerView', function (_, $) {
        var stateRadius = 12;
        var arrowHeadSize = 3;

        function xCanvas(canvas) {
            function State(_id, _name, _next, _isInitial, _isFinal, _isPlanned) {
                this.ID = _id;
                this.name = _name;
                this.next = _next;
                this.x = 0;
                this.y = 0;
                this.angle = 0;
                this.isInitial = _isInitial;
                this.isFinal = _isFinal;
                this.isPlanned = _isPlanned;
            }

            var that = this;
            if (!canvas.getContext) {
                console.error('not compatible with HTML5');
            }

            var context = canvas.getContext("2d");
            var allStatesRadius = canvas.width / 2 - 100;

            this.backColor = "white";

            var states = [];
            this.SetStates = function (statesData) {
                states = _.map(statesData, function (state) {
                    var name = state.name.length > 12 ? state.name.substring(0, 12) + '...' : state.name;
                    return new State(state.id, name, _.pluck(state.nextStates.items, 'id'), state.isInitial, state.isFinal, state.isPlanned);
                });
                this.Update();
            };

            this.Update = function () {
                var delta = 2 * Math.PI / states.length;
                var angle = -Math.PI / 2;
                var cx = canvas.width / 2;
                var cy = canvas.height / 2;

                for (var s = 0; s < states.length; s++) {
                    states[s].x = cx + allStatesRadius * Math.cos(angle);
                    states[s].y = cy + allStatesRadius * Math.sin(angle);
                    states[s].angle = angle;
                    angle += delta;
                }

                context.fillStyle = this.backColor;
                context.fillRect(0, 0, canvas.width, canvas.height);

                for (var o = 0; o < states.length; o++) {
                    var state = states[o];
                    this.DrawState(state);
                    for (var n = 0; n < state.next.length; n++) {
                        this.DrawLinkByStates(state, _.findWhere(states, {ID: state.next[n]}));
                    }
                }
            };
            this.DrawState = function (state) {
                context.font = "12px Arial";
                context.fillStyle = "Black";
                var sz = context.measureText(state.name);

                var coos = Math.cos(state.angle);
                var siin = Math.sin(state.angle);

                var x = state.x;
                var y = state.y;

                if (coos < 0) {
                    x -= sz.width + stateRadius + 5;
                } else if (coos > 0) {
                    x += stateRadius + 5;
                }

                if (siin < 0) {
                    y -= stateRadius;
                } else {
                    y += stateRadius;
                }
                context.fillText(state.name, x, y);

                context.lineWidth = 1;
                context.strokeStyle = "#444";
                context.beginPath();
                context.arc(state.x, state.y, stateRadius, 0 * Math.PI, 2 * Math.PI);
                if (state == hoverState) {
                    context.fillStyle = "#268a1b";
                } else if (state.isInitial) {
                    context.fillStyle = "#90dd80";
                } else if (state.isPlanned) {
                    context.fillStyle = "#4d97ff";
                } else if (state.isFinal) {
                    context.fillStyle = "#666666";
                } else {
                    context.fillStyle = "#A0A0A0";
                }
                context.fill();
                context.stroke();
            };

            this.DrawLinkByStates = function (st1, st2) {
                if (st1 == hoverState || st2 == hoverState) {
                    this.DrawLink(st1.x, st1.y, st2.x, st2.y, null, "#268a1b");
                } else if (StateHasLink(st2, st1)) {
                    this.DrawLink(st1.x, st1.y, st2.x, st2.y, null, "#444");
                } else {
                    this.DrawLink(st1.x, st1.y, st2.x, st2.y, null, "#888");
                }
            }

            this.DrawLink = function (x1, y1, x2, y2, noOffset, linkColor) {

                var angle = Math.atan2(y2 - y1, x2 - x1);
                var offs = noOffset ? 0 : arrowHeadSize + stateRadius + 3;
                var color = linkColor ? linkColor : "#000000";

                var rx1 = x1 - offs * Math.cos(angle + Math.PI);
                var ry1 = y1 - offs * Math.sin(angle + Math.PI);

                var rx2 = x2 - offs * Math.cos(angle);
                var ry2 = y2 - offs * Math.sin(angle);

                context.lineWidth = 1.5;
                context.strokeStyle = color;
                context.fillStyle = color;
                context.beginPath();
                context.moveTo(rx1, ry1);
                context.lineTo(rx2, ry2);
                this.DrawArrowHead(rx2, ry2, angle);
                context.stroke();
                context.fill();
                context.closePath();
            }

            this.DrawArrowHead = function (x, y, direction) {
                var x1 = x + arrowHeadSize * Math.cos(direction);
                var y1 = y + arrowHeadSize * Math.sin(direction);
                var x2 = x + arrowHeadSize * Math.cos(direction - 2 * Math.PI / 3);
                var y2 = y + arrowHeadSize * Math.sin(direction - 2 * Math.PI / 3);
                var x3 = x + arrowHeadSize * Math.cos(direction + 2 * Math.PI / 3);
                var y3 = y + arrowHeadSize * Math.sin(direction + 2 * Math.PI / 3);

                context.moveTo(x1, y1);
                context.lineTo(x2, y2);
                context.lineTo(x3, y3);
                context.lineTo(x1, y1);
            }

            function StateHasLink(fromState, toState) {
                for (var n = 0; n < fromState.next.length; n++) {
                    if (fromState.next[n] == toState.ID) {
                        return true;
                    }
                }
                return false;
            }

            function FindState(x, y) {
                for (var o = 0; o < states.length; o++) {
                    var st = states[o];
                    if ((st.x - x) * (st.x - x) + (st.y - y) * (st.y - y) < 25 * 25) {
                        return st;
                    }
                }
                return null;
            }

            function ConvertCoords(e) {
                var x;
                var y;
                if (e.pageX || e.pageY) {
                    x = e.pageX;
                    y = e.pageY;
                } else {
                    x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                    y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
                }

                x -= $(canvas).offset().left;
                y -= $(canvas).offset().top;

                return {x: x, y: y};
            }

            var fromState = null;
            var endX = 0;
            var endY = 0;
            var hoverState = null;

            this.onMouseMove = function (e) {
                var coord = ConvertCoords(e);
                var tx = coord.x;
                var ty = coord.y;
                var st = FindState(tx, ty);
                if (st != null) {
                    hoverState = st;
                } else {
                    hoverState = null;
                }

                this.Update();
            };

            function isContainLink(state, id) {
                for (var n = 0; n < state.next.length; n++) {
                    if (state.next[n] == id) {
                        return true;
                    }
                }

                return false;
            }

            function removeLink(state, id) {
                for (var n = 0; n < state.next.length; n++) {
                    if (state.next[n] == id) {
                        state.next.splice(n, 1);
                    }
                }
                $(canvas).trigger('change');
                return false;
            }

            this.bind = function (event, fn) {
                $(canvas).bind(event, fn);
            }

            this.onMouseUp = function (e) {
                var coord = ConvertCoords(e);
                var tx = coord.x;
                var ty = coord.y;
                if (fromState != null) {
                    var st = FindState(tx, ty);
                    if (st != null && st != fromState) {
                        if (isContainLink(fromState, st.ID)) {
                            removeLink(fromState, st.ID);
                        } else {
                            fromState.next.push(st.ID);
                        }
                    }
                }
                fromState = null;
                this.Update();
            }

            this.onMouseDown = function (e) {
                var coord = ConvertCoords(e);
                var tx = coord.x;
                var ty = coord.y;

                var st = FindState(tx, ty);
                if (st != null) {
                    fromState = st;
                }
            }

            canvas.addEventListener("mousemove", _.bind(that.onMouseMove, this), false);

        }

        return xCanvas;
    });
