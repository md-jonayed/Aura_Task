({
    doInit : function(component, event, helper) {
        component.set('v.columns', [
            {label: 'Type', fieldName: 'Type', type: 'text'},
            {label: 'Name', fieldName: 'Name', type: 'text'},
            {label: 'Stage', fieldName: 'StageName', type: 'picklist'} // No direct picklist type, use text
        ]);
        
        helper.fetchOpportunities(component);
    }
})