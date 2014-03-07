Custom Field Constraints
======================

The Custom Field Constraints mashup allows a custom field to be required in either of the following cases:

1. When an entity is moved to a specific state (Entity State Constraints)
2. When a specific value is selected in another custom field (Custom Field Constraints)

_Note: Only Text, Drop-Down List and Multiple Selection List types of custom fields are supported in the mashup._

After the mashup has been installed, it will need to be configured. Click the Custom Field Constraints mashup in the list of mashups and perform the following changes in it’s code, as it is shown on the picture below:

![Assigned Effort Report](https://github.com/TargetProcess/TP3MashupLibrary/raw/master/Custom%20Field%20Constraints/code.png)

1) Specify a _Process ID_, which the custom field belongs to, as a ```‘processId:’``` value.

2) Specify an _Entity Type_, which the custom field was created for, as a ```‘constraints:’``` value.


__To configure Entity State Constraints__

3) Specify an _Entity State_, when moving to this state in the workflow the custom field will be required, as a ```‘name:’``` in an ```‘entityStates:’``` section.

4) Specify a _Name_ of a Custom Field, which will be required, as a ```‘requiredCustomFields:’``` in an ```‘entityStates:’``` section. 

_Note: In the case where multiple custom fields are required, provide a comma separated list of custom fields._


__To configure Custom Field Constraints__

5) Specify the _Name_ of a Custom Field, which contains the constrained value, as a ```‘name:’```  in a ```‘customFields:’``` section.


6) Specify the _Constrained value_, which makes a dependent Custom Field required, as a ```‘valueIn:’``` in a ```‘customFields:’``` section.

_Note: In case you need to make a custom field required, when any value except the specified one, is provided, use ```‘valueNotIn’``` instead of ```‘valueIn’``` operator._

7) Specify a _Name_ of a Custom Field, which should become required, as a ```‘requiredCustomFields:’``` in a ```‘customFields:’``` section.

8) Click ‘Save Mashup’ button.

After the Custom Field Constraints mashup has been configured and one of actions has been triggered you will see a popup to provide the a value for required custom field:


![Assigned Effort Report](https://github.com/TargetProcess/TP3MashupLibrary/raw/master/Custom%20Field%20Constraints/popup.png)
