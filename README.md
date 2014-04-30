lpj-validation
==========

lpj-validation is a jQuery plugin that provides the ability to perform simple or complex client side validation and show an error on any DOM element.

Simply apply the validator to the element specified by the jQuery selector and pass it a function(s) to validate against. 


Return values:

  Empty string = the validation passes,
  Error Message = the message will show in an error bubble above the form field


Usage:

  myValidator = $("#my-text-box").validator({
    trigger: "blur",
    rules:[
      {
        rule: function(elem)
        {
          // Blank
          return $(elem).val() !== "" ? "" : "This field is required."
        }
      }, 
      {
        rule: function(elem)
        {
          // Numeric
          return regexTest($(elem).val(), /[\d,\.-]/) ? "" : "Only alpha-numeric please.";
        }
      }
    ]
  });


