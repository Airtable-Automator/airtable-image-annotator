# Image Annotation Block

Image Annotation block allows you to annotate (label) images so that you can train a classifier ML model

# How does it work?

* From the Settings screen, the user can select the `Table`, `View`, `Attachment Column` that stores the image and the `Annotation` column - a single select column with options that will be use as the annotation values
* On click `Start Annotation`, the user will be shown all the images from the select `Table` - `View` combination, allowing the user to select the right annotation for the image shown on the screen.
* Once the user selects the right annotation, they can go to the next record. They can also skip the record and come back to it later. 
* There is a timer that automatically skips the record if the user does not select an option within the stipulated time. The timer duration can be configured from the Settings screen
* Once the user goes through the annotation tasks, a summary is shown. The user can go back and annotate the ones they skipped. 
* The annotation values are automatically stored in the selected field. If the user uses the block again, only the records which are not annotated are shown to the user. 

## TODOs
- [x] Annotation Task - `Skip Record` button should skip the current task 
- [ ] Annotation Task - Disable `Next Record` button unless the user selects an option
- [ ] Settings - Move the labels addition to Settings screen instead of expecting a `SINGLE_SELECT` column in the table
- [ ] Annotation Completion - Wording in the completion screen and statistics 
- [ ] Annotation Task - Move the timer duration to Settings screen
- [ ] Annotation Task - Improve the CSS selector 

## Notes

This block was remixed using the `Name Quiz` open source block available here.