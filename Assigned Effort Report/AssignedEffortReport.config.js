tau.mashups
    .addModule('AssignedEffortReport.config', function() {

        return {
			/* Samples of conditions:

			1. Get all the assignments:
			CONDITION: null
			
			2. Get only assignments for the current Iteration (Sprint):
			CONDITION: 'Iteration.IsCurrent eq "true"'
			
			3. Get only assignments for the current Release:
			CONDITION: 'Release.IsCurrent eq "true"' 
			
			4. Get only assignments for the current Team Iteration (Team Sprint):
			CONDITION: 'TeamIteration.IsCurrent eq "true"'
			
			5. Get only assignments for an Iteration (Sprint) with ID 123:
			CONDITION: 'Iteration.Id eq "123"'
			
			6. Get only assignments for a Release with ID 123:
			CONDITION: 'Release.Id eq "123"'
			
			7. Get only assignments for a Team Iteration (Team Sprint) with ID 123:
			CONDITION: 'TeamIteration.Id eq "123"'
			
			8. Get only assignments, where Entity State is not initail
			CONDITION: 'EntityState.IsInitial eq "false"'
 
			*/
			
            CONDITION: null
        };
    }
);
