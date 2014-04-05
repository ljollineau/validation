/**
* lpj-validation.js
* Copyright (c) 2014 Lane Jollineau
 
* @author Lane Jollineau (lane@jollineau.com)
* @date 04/04/2014
* @description 
*       Custom client side validation framework
* @version      1.0.0
* @dependency   jQuery 1.7.1
*/
if(typeof console === "undefined") var console = {log: function(){}}

; (function ($) {

    var Validator = function (el, params) {

        var elem = $(el);
        var options = $.extend({

            trigger: "blur",
            active: true,
            rules: [],
            allowedCharacters: null,
            validate: function (e) {

                if(!options.active) return;
            
                var message = "";
                
                $.each(options.rules, function(i){
                    if (typeof this.rule === "function") 
                        message = this.rule(elem, options, e);
                    
                    if(message !== "") return false;
                        
                });

                if(message !== "") {
                    var speed = (typeof error !== "undefined" 
                                        && error !== null 
                                        && message == error.Message) ? 0 : null
                    reset(speed);
                    error = new Error();
                    error.Elem = (elem.length > 1) ? elem.first() : elem ;
                    error.Message = message;
                    error.Init();
                }else{
                    reset();
                }
            }

        }, params || {});

        //---- Private Props
        var error, 
        active;

        var init = function () {

            elem.bind(options.trigger+".validator", function(event){
                options.validate(event);
            });

            elem.bind("focus.validator", function(event){
                reset();
            });

            if(options.allowedCharacters !== null){
                elem.bind("keypress.validator", function(event){
                    return filterKey(event);
                });
            }
        }

        //------ Private Methods
        var reset = function(speed){ 
            speed = (typeof speed != "undefined") ? speed : 0 ;
            if(typeof error !== "undefined" && error !== null){ 
                error.Remove(speed);
                error = null;
            }
        }

        var filterKey = function (event) {

            var k = event.which;

            if ((k >= 32 && k <= 126) || k > 186) 
                if (!regexTest(String.fromCharCode(k), options.allowedCharacters)) return false;

            if (k === 13) elem.trigger(options.trigger);
            return true;
        }

        //----- Public Methods
        this.Reset = function(){
            reset();
        }
        
        this.Activate = function(){
            options.active = true;
        }
        
        this.Deactivate = function(){
            options.active = false;
            reset();
        }
        
        this.GetElem = function(){
            return elem;
        }

        this.GetOptions = function() {
            return options;
        }

        this.Validate = function(){
            
            //elem.trigger(options.trigger+".validator");
            options.validate();
            return error === null || typeof error === "undefined";
        }

        //---- Constructor
        init();

    };

    // --------- Validation jQuery plugin -----------//

    $.fn.validator = function (params) {

        // Make sure we have an options object
        params = (params) ? params : {};

        var validator = new Validator(this, params);
        $(this).data("validator", validator);

        return $(this).data("validator");

    };

})(jQuery);

// Validation Error Base Class
var Error = function () {
    
    var props,
    params,
    errorID,
    elem,
    message;

    this.Elem;
    this.ErrorParams = {};
    this.Message;
    this.Props;

    this.Init = function(){

        params = this.ErrorParams;
        //elem = (this.Elem.length > 1) ? this.Elem.first() : this.Elem;
        elem = this.Elem;
        message = this.Message;
        errorID = 'valError_' + elem.attr("id");

        $("#"+errorID).remove();

        this.Props = $.extend({
            id: errorID,
            errorString: "<div class='error-message' id='" + errorID + "'><div class='error-text'>" + message + "</div></div>",
            speed: ($.browser.msie) ? 0 : 400,
            controlPosition: elem.offset(),
            cssclass: "error-control"
        }, params || {});

        props = this.Props;
        this.Display();
    }
    
    this.Arrow = function(error){
        var arrow = "<div class='error-arrow'><div class='line10'><!-- --></div><div class='line9'><!-- --></div><div class='line8'><!-- --></div><div class='line7'><!-- --></div><div class='line6'><!-- --></div><div class='line5'><!-- --></div><div class='line4'><!-- --></div><div class='line3'><!-- --></div><div class='line2'><!-- --></div><div class='line1'><!-- --></div></div>";

        error.append(arrow);
    }

    this.Display = function(){

        // Add error message to the DOM
        $("body").append(props.errorString);
        var error = $("#" + errorID);
        error.css(
            { 
                'top': props.controlPosition.top - error.height() - 6, 
                'left': props.controlPosition.left + 6
            }
        );
        this.Arrow(error);
        elem.addClass(props.cssclass);
        error.fadeIn(props.speed);
    }

    this.Remove = function (speed) {

        $("#" + errorID).fadeOut(speed, function(){
            $(this).remove();
        });
    }

};

var regexTest = function(x, y) {
        
    var expression = new RegExp(y);
    return (expression.test(x));

}

if (!$.browser) {
    $.browser = { msie: /MSIE (\d+\.\d+);/.test(navigator.userAgent) };
}