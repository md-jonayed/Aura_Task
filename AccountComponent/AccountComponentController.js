({
    doInit : function(component, event, helper) {
        // Define columns for lightning:datatable
        component.set('v.columns', [
            {label: 'Name', fieldName: 'Name', type: 'text'},
            {label: 'Top Account', fieldName: 'Top_Account__c', type: 'boolean'},
            {label: 'Industry', fieldName: 'Industry', type: 'picklist'} // Note: no direct picklist type in datatable, will treat as text
        ]);
        
        // Call helper to fetch accounts
        helper.fetchAccounts(component);
    }
})