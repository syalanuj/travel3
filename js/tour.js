(function(){
 
    var tour = new Tour({
        storage : false,
		
		});
 
    tour.addSteps([
      {
        element: ".tour-step.tour-step-one",
        placement: "bottom",
		backdrop: true,
        title: "Add a cover photo",
        content: "Start documenting your trip by adding a cover photo. This photo will showcase your entire journey. Be sure to choose a pretty one!"
      },
      {
        element: ".tour-step.tour-step-two",
        placement: "top",
		backdrop: true,
        title: "Enter a title",
        content: "Give your journey a name!"
      },
      {
        element: ".tour-step.tour-step-three",
        placement: "top",
        backdrop: true,
        title: "Add a summary",
        content: "Add a small description to tell the readers what your journey was about, what inspired it; give it a small prologue."
      },
	  {
        element: ".tour-step.tour-step-four",
        placement: "top",
        backdrop: true,
        title: "Add tags",
        content: "Add meta-tags to your journey to describe it in a few words and make it more discoverable. "
      },
	  {
        element: ".tour-step.tour-step-five",
        placement: "top",
        backdrop: true,
        title: "Location Card",
        content: "This is a location card. Every location card will depict a new checkpoint in your journey. You can add as many location cards as you want."
      },
	  {
        element: ".tour-step.tour-step-six",
        placement: "top",
        backdrop: true,
        title: "Click here to another card",
        content: "This opens another location card."
      },
	  {
        element: ".tour-step.tour-step-seven",
        placement: "top",
        backdrop: true,
        title: "Click here to start all over",
        content: "Clicking here deletes all the data in your form. We don't see why you will have to use this."
      },
		{
        element: ".tour-step.tour-step-eight",
        placement: "top",
        backdrop: true,
        title: "Good to go!",
        content: "Click here to publish your trip."
      },
		{
        element: ".tour-step.tour-step-nine",
        placement: "top",
        backdrop: true,
        title: "Main section",
        content: "This is a section that you can read. It has valuable information."
      },

 
    ]);
 
    // Initialize the tour
    tour.init();
 
    // Start the tour
    tour.start();
 
}());