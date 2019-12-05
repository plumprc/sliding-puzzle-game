(function() {
    class puzzle {
        constructor() {
            // 修改成可视化的图片列表选项
            this.background = [
                "asset/tmp.jpg",
                "asset/tmp2.jpg",
                "asset/tmp3.jpg",
                "asset/tmp4.jpg",
            ];
            
            this.cheater = document.getElementById("block_8");
            this.cheater_cnt = 0;

            this.block = document.getElementsByClassName("block");
            this.order = document.getElementsByClassName("order");
            this.success = document.getElementById("success");
            this.stepCnt = document.getElementById("step");
            this.succStep = document.getElementById("suc_step");
            this.btn = {
                changeImg: document.getElementById("change"),
                shuffle: document.getElementById("shuffle"),
                showNum: document.getElementById("showNum"),
                hint: document.getElementById("hint"),
                again: document.getElementById("successB")
            };
            this.sus_img = document.getElementById("sus_img");
            this.img_ = 0; //当前图片序号
            this.step = 0; //记录步数
            this.nowOrder = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]); //当前块排序
            this.distanceCount = 0;
            this.isShowOrder = 'ShowNum';
            
            this.init();
            this.bind();
        }

        // 分割图片，位置初始化
        init() {
            var _this = this;

            Array.prototype.forEach.call(this.block, function (ele, i) {
                let po = _this.nowOrder.indexOf(i);
                let y = Math.floor(po / 3);
                let x = po % 3;
                ele.style.left = x * 100 + "px";
                ele.style.top = y * 100 + "px";
            });
            
            _this.stepCnt.innerHTML = _this.step;

            console.info(calcManhanttanDistance(_this.nowOrder));
        }

        // 可移动条件修正
        moveable(i, j) {
           let realCol = j % 3;
           let realRow = Math.floor(j / 3);
           let col = i % 3;
           let row = Math.floor(i / 3);
           return (Math.abs(realCol - col) + Math.abs(realRow - row));
        }

        bind() {
            var _this = this;
            //block
            Array.prototype.forEach.call(this.block, function (ele, i) {
                ele.onclick = function () {
                    // 与空方块相邻，可移动，这个又得重写可移动条件，写好了233
                    let blankIndex = _this.nowOrder.indexOf(8);
                    let tmpIndex = _this.nowOrder.indexOf(i);
                    if (moveDis(tmpIndex, blankIndex) == 1) {
                        var tmp = _this.nowOrder[blankIndex];
                        _this.nowOrder[blankIndex] = _this.nowOrder[tmpIndex];
                        _this.nowOrder[tmpIndex] = tmp;
                        //统计步数
                        _this.step++;
                        _this.init();
                        //剩余距离
                        _this.distanceCount = calcManhanttanDistance(_this.nowOrder);
                    
                        if (_this.distanceCount == 0) {
                            _this.successShow();
                        }
                    }
                };
            });
            
            // 可以用 promise/回调 写出多次点击事件嘛？
            this.cheater.onclick = function() {
                _this.cheater_cnt++;
                if(_this.cheater_cnt > 6) {
                    _this.cheater_cnt = 0;
                    _this.nowOrder = [0, 1, 2, 3, 4, 5, 6, 8, 7];
                    _this.init();
                }
            }

            this.btn.shuffle.onclick = this.btn.again.onclick = function () {
                _this.nowOrder = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]);
                
                console.info(_this.nowOrder);
                _this.step = 0;
                _this.init();
                _this.bind();
                _this.success.style.display = "none";
                _this.block[8].style.opacity = "0";
            };
            
            this.btn.showNum.onclick = function () {
                if (_this.isShowOrder == 'ShowNum') {
                    Array.prototype.forEach.call(_this.order, function (ele, i) {
                        ele.style.display = "block";
                    });
                    _this.isShowOrder = 'HideNum';
                }
                else {
                    Array.prototype.forEach.call(_this.order, function (ele, i) {
                        ele.style.display = "none";
                    });
                    _this.isShowOrder = 'ShowNum';
                }
                _this.btn.showNum.innerHTML = _this.isShowOrder;
            };

            this.btn.changeImg.onclick = function () {
                if (_this.img_ == 3)
                    _this.img_ = 0;
                else
                    _this.img_++;
                Array.prototype.forEach.call(_this.block, function (ele, i) {
                    ele.style.backgroundImage = "url(" + _this.background[_this.img_] + ")";
                });
                
                _this.sus_img.style.backgroundImage = "url(" + _this.background[_this.img_] + ")";

                _this.nowOrder = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]);
                _this.step = 0;
                _this.init();

            };
            //A*
            this.btn.hint.onclick = function () {
                _this.aStar();
            };
        }

        // A*，需要设计一个防止执行成功前多次点击触发的策略
        aStar() {
            var puzzle = this.nowOrder;
            startTime = new Date();
            aStarSearch(puzzle);
            endTime = new Date();
            console.log('Operation took ' + (endTime.getTime() - startTime.getTime()) + ' msec');
            console.info(path.length);
            console.info("233");
            var len = path.length - 2;

            var timer = setInterval(() => {
                if (len < 0 ) { clearInterval(timer); }
                this.nowOrder = path[len--];
                this.init();
                this.step++;
                if (len < 0 ) { 
                    clearInterval(timer);
                    this.successShow();
                    initParam();
                }
            }, 300);

        }

        //成功
        successShow() {
            this.block[8].style.opacity = "1";
            setTimeout(() => (this.success.style.display = "block"), 800);
            this.succStep.innerHTML = this.step;
        }

    }

    window.Puzzle=function(){
        new puzzle();
    }

})()


window.onload=function () {
    window.Puzzle();
}
