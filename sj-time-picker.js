angular.module('sj-time-picker', []).directive('sjTimePicker', function(){
  console.log('found  a sj picker');
  return {
    restrict: 'A',
    require: '^ngModel',
    scope: {
      ngModel: '='
    },
    link: function(scope, element, attrs, ngModel){
      var mask = "13:00";
      var lastKnownCursorPosition = 0;
      scope.ngModel = mask;
      element.on('mousewheel ', function(e){
        if(e.originalEvent.wheelDelta >=0){
          if(lastKnownCursorPosition < 3){
            var times = this.value.split(':');
            times[0] = +(times[0])+ 1;
            if(+times[0] > 23)
            {
              times[0] = 0;
            }
            times[0] = "" + times[0];
            times[0] = "00" . substring(0, 2-times[0].length) + times[0];
            this.value = times.join(':');
          }
          else{
            var times = this.value.split(':');
            times[1] = +(times[1])+ 1;
            if(+times[1] > 59)
            {
              times[1] = 0;
            }
            times[1] = "" + times[1];
            times[1] = "00" . substring(0, 2-times[1].length) + times[1];
            this.value = times.join(':');
          }
        }else {
          if(lastKnownCursorPosition < 3){
            var times = this.value.split(':');
            times[0] = +(times[0])- 1;
            if(+times[0] < 0)
            {
              times[0] = 23;
            }
            times[0] = "" + times[0];
            times[0] = "00" . substring(0, 2-times[0].length) + times[0];
            this.value = times.join(':');
          }
          else{
            var times = this.value.split(':');
            times[1] = +(times[1]) - 1;
            if(+times[1] < 0)
            {
              times[1] = 59;
            }
            times[1] = "" + times[1];
            times[1] = "00" . substring(0, 2-times[1].length) + times[1];
            this.value = times.join(':');
          }
        }
        setCaretPosition(this, lastKnownCursorPosition)
        e.preventDefault();
      });
      element.bind('click',function(e){
        lastKnownCursorPosition = getCaretPosition(this);
      });
      element.bind('keydown', function(e){
        var newChar = e.key;
        var caretPos = getCaretPosition(this);

        var startValue = this.value;
        var value = element[0].value;

        if(!isNaN(newChar)){
          e.preventDefault();
          var times = this.value.split(':');
          switch (caretPos) {
            case 0:
              if(newChar <=2 )
              {
                this.value = newChar + value.substring(1);
                lastKnownCursorPosition = caretPos + 1;
                setCaretPosition(this, lastKnownCursorPosition)
              }
              else {
                this.value = "0" + newChar + value.substring(2);
                lastKnownCursorPosition = 3;
                setCaretPosition(this, lastKnownCursorPosition)
              }
              break;
            case 1:
                this.value = value.substring(0,caretPos) + newChar + value.substring(caretPos+1);
                lastKnownCursorPosition = caretPos + 1;
                setCaretPosition(this, lastKnownCursorPosition)
              break;
            case 2:
            caretPos++;
            case 3:
              if(newChar <=6 )
              {
                this.value = value.substring(0,caretPos) + newChar + value.substring(caretPos + 1);
                lastKnownCursorPosition = caretPos + 1;
                setCaretPosition(this, lastKnownCursorPosition)
              }else {
                this.value = value.substring(0,caretPos) + "0" + newChar;
                lastKnownCursorPosition = 5;
                setCaretPosition(this, lastKnownCursorPosition)
              }
              break;
            case 4:
              this.value = value.substring(0,4) + newChar;
              lastKnownCursorPosition = 5;
              setCaretPosition(this, lastKnownCursorPosition)
              break;
            default:

          }

        }
        //Backspace
        else if(e.which == 8){
          switch (caretPos) {

            case 3:
             caretPos--;
            case 1:
            case 2:
            case 4:
            case 5:
              this.value = this.value.substring(0,caretPos-1) + '0' + this.value.substring(caretPos);
              lastKnownCursorPosition = caretPos - 1;
              setCaretPosition(this, lastKnownCursorPosition);
              break;

            default:

          }

          e.preventDefault();
        }
        //Delete
        else if(e.which == 46){
          switch (caretPos) {

            case 2:
             caretPos++;
            case 1:
            case 3:
            case 4:
            case 0:
              this.value = this.value.substring(0,caretPos) + '0' + this.value.substring(caretPos+1);
              lastKnownCursorPosition = caretPos + 1;
              setCaretPosition(this, lastKnownCursorPosition);
              break;

            default:

          }

          e.preventDefault();
        }
        else if(e.which == 9){
        }
        else if(e.which == 37 )
        {
          lastKnownCursorPosition--;
          if (lastKnownCursorPosition < 0) {
            lastKnownCursorPosition = 0;
          }
        }
        else if(e.which == 39 )
        {
          lastKnownCursorPosition++;
          if(lastKnownCursorPosition > 5)
          {
            lastKnownCursorPosition = 5;
          }
        }


        else{
          e.preventDefault();
        }
        console.log(lastKnownCursorPosition);


      });
      scope.$watch(attrs.ngModel, function(newValue,oldValue){
        //console.log(oldValue + newValue);

      });



      function isFocused (elem) {
        return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
      }
      //Taken from https://github.com/angular-ui/ui-mask
      function getCaretPosition(input) {
        if (!input)
        return 0;
        if (input.selectionStart !== undefined) {
          return input.selectionStart;
        } else if (document.selection) {
          if (isFocused(iElement[0])) {
            // Curse you IE
            input.focus();
            var selection = document.selection.createRange();
            selection.moveStart('character', input.value ? -input.value.length : 0);
            return selection.text.length;
          }
        }
        return 0;
      };
      //Taken from https://github.com/angular-ui/ui-mask
      function setCaretPosition(input, pos) {
        if (!input)
        return 0;
        if (input.offsetWidth === 0 || input.offsetHeight === 0) {
          return; // Input's hidden
        }
        if (input.setSelectionRange) {
          if (isFocused(element[0])) {
            input.focus();
            input.setSelectionRange(pos, pos);
          }
        }
        else if (input.createTextRange) {
          // Curse you IE
          var range = input.createTextRange();
          range.collapse(true);
          range.moveEnd('character', pos);
          range.moveStart('character', pos);
          range.select();
        }
      };
    }
  };
});
