(function() {
    class puzzle {
        constructor() {
            this.background = [
                "asset/img1.jpg",
                "asset/img2.jpg",
                "asset/img3.jpg",
                "asset/img4.jpg",
            ];
            // cheating mode
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
                hideImage: document.getElementById("hideImage"),
                hint: document.getElementById("hint"),
                again: document.getElementById("successB")
            };

            this.isAStar = true;
            this.showImage = document.getElementById("imgHint");
            this.sus_img = document.getElementById("sus_img");
            this.img_ = 0; // current img num
            this.step = 0; // moving step
            this.nowOrder = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]); // current ordering of patches
            this.distanceCount = 0;
            this.isShowOrder = 'HideImage';
            
            this.init();
            this.bind();
        }

        // segment image into blocks given nowOrder
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

        bind() {
            var _this = this;
            Array.prototype.forEach.call(this.block, function (ele, i) {
                ele.onclick = function () {
                    // Adjacent to an empty block, movable
                    let blankIndex = _this.nowOrder.indexOf(8);
                    let tmpIndex = _this.nowOrder.indexOf(i);
                    if (moveDis(tmpIndex, blankIndex) == 1) {
                        var tmp = _this.nowOrder[blankIndex];
                        // update nowOrder
                        _this.nowOrder[blankIndex] = _this.nowOrder[tmpIndex];
                        _this.nowOrder[tmpIndex] = tmp;
                        _this.step++; // moving step
                        _this.init();
                        // Manhattan distance
                        _this.distanceCount = calcManhanttanDistance(_this.nowOrder);
                    
                        if (_this.distanceCount == 0) {
                            _this.successShow();
                        }
                    }
                };
            });
            
            // click on the blank block seven times for a surprise~
            this.cheater.onclick = function() {
                _this.cheater_cnt++;
                if(_this.cheater_cnt > 6) {
                    _this.cheater_cnt = 0;
                    _this.nowOrder = [0, 1, 2, 3, 4, 5, 6, 8, 7];
                    _this.init();
                }
            }

            // shuffle the puzzle
            this.btn.shuffle.onclick = this.btn.again.onclick = function () {
                _this.nowOrder = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]);
                
                console.info(_this.nowOrder);
                _this.step = 0;
                _this.init();
                _this.bind();
                _this.success.style.display = "none";
                _this.block[8].style.opacity = "0";
            };
            
            // hide the reference image
            this.btn.hideImage.onclick = function () {
                if (_this.isShowOrder == 'HideImage') {
                    _this.showImage.style.display = "none";
                    _this.isShowOrder = 'ShowNum';
                }
                else if (_this.isShowOrder == 'ShowNum') {
                    Array.prototype.forEach.call(_this.order, function (ele, i) {
                        ele.style.display = "block";
                    });
                    _this.isShowOrder = 'HideNum';
                }
                else if (_this.isShowOrder == 'HideNum') {
                    Array.prototype.forEach.call(_this.order, function (ele, i) {
                        ele.style.display = "none";
                    });
                    _this.isShowOrder = 'ShowImage';
                }
                else {
                    _this.showImage.style.display = "block";
                    _this.isShowOrder = 'HideImage';
                }
                _this.btn.hideImage.innerHTML = _this.isShowOrder;
            };

            // change the image of puzzle
            this.btn.changeImg.onclick = function () {
                if (_this.img_ == 3)
                    _this.img_ = 0;
                else
                    _this.img_++;
                Array.prototype.forEach.call(_this.block, function (ele, i) {
                    ele.style.backgroundImage = "url(" + _this.background[_this.img_] + ")";
                });
                
                _this.showImage.style.backgroundImage = "url(" + _this.background[_this.img_] + ")";
                _this.sus_img.style.backgroundImage = "url(" + _this.background[_this.img_] + ")";
            
                _this.nowOrder = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]);
                _this.step = 0;
                _this.init();
            
            };

            // A* algorithm
            this.btn.hint.onclick = function () {
                if(_this.isAStar == true){
                    _this.aStar();
                }
            };
        }

        // isAStar to prevent multiple triggers before successful execution
        aStar() {
            this.isAStar = false;
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
                    this.isAStar = true;
                }
            }, 300);
        }

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
