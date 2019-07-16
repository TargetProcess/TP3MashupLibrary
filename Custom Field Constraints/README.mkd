# Custom Field Constraints

The Custom Field Constraints mashup allows a custom field to be required in either of the following cases:

1. When an entity is moved to a specific state (Entity State Constraints)
2. When a specific value is selected in another custom field (Custom Field Constraints)

After the mashup has been installed, it will need to be configured. Click the Custom Field Constraints mashup in the list of mashups and perform the following changes in it’s code:

* Specify a _Process Name_, which the custom field belongs to, as a ```‘process:’``` value (for entities dependent on a process).
* Specify an _Entity Type_, which the custom field was created for, as a ```‘constraints:’``` value.


## To configure Entity State Constraints

* Specify an _Entity State_, when moving to this state in the workflow the custom field will be required, as a ```‘name:’``` in an ```‘entityStates:’``` section.
* Specify a _Name_ of a Custom Field, which will be required, as a ```‘requiredCustomFields:’``` in an ```‘entityStates:’``` section. 

_Note: In the case where multiple custom fields are required, provide a comma separated list of custom fields.
Also, when you use [custom team workflows](https://www.targetprocess.com/guide/settings/states-workflows/team-workflow/), 
specify the Entity State for related Project Workflow instead of a Team one._


## To configure Custom Field Constraints

* Specify the _Name_ of a Custom Field, which contains the constrained value, as a ```‘name:’```  in a ```‘customFields:’``` section.
* Specify the _Constrained value_, which makes a dependent Custom Field required, as a ```‘valueIn:’``` in a ```‘customFields:’``` section.
* In case you need to make a custom field required, when any value except the specified one, is provided, use ```‘valueNotIn’``` instead of ```‘valueIn’``` operator.
* Specify a _Name_ of a Custom Field, which should become required, as a ```‘requiredCustomFields:’``` in a ```‘customFields:’``` section.
* _Optional_: Specify the popup's _note_ when need to provide the value for required custom field.

## To apply the mashup

* Click ‘Save Mashup’ button.
* Refresh your page:
	* Windows: ctrl + F5
	* Mac/Apple: Apple + R or command + R
	* Linux: F5

	
After the Custom Field Constraints mashup has been configured and one of actions has been triggered you will see a popup to provide the a value for required custom field:

![Custom Field Constraints Popup](https://github.com/TargetProcess/TP3MashupLibrary/raw/master/Custom%20Field%20Constraints/popup.png)
