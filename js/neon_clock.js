(function (w, d) {

    var timerCache = '',
        timerNum = d.querySelectorAll('.timer-num');  

    setInterval(timerUpdata, 200);

    function timerUpdata() {
        var timerArr = timerHandler(new Date());
        if (timerArr == null) {
            return;
        }
        timerNum.forEach(function (element, index) {
            element.innerHTML = timerArr ? timerArr[index] : '-';
        });
    }

    
    function timerHandler(dateObj) {
        var hours = ('0' + dateObj.getHours()).slice(-2); 
        var min = ('0' + dateObj.getMinutes()).slice(-2); 
        var sec = ('0' + dateObj.getSeconds()).slice(-2);
        var timerStr = hours + min + sec;
        if (timerStr == timerCache) {
            return null;
        }
        timerCache = timerStr;
        return timerStr.split(''); 
    }
})(window, document);

