({
    doInit : function(component, event, helper) {
        component.set('v.columns', [
            {label: 'Name', fieldName: 'Name', type: 'text'},
            {label: 'Email', fieldName: 'Email', type: 'email'},
            {label: 'Phone', fieldName: 'Phone', type: 'phone'},
            {label: 'Fax', fieldName: 'Fax', type: 'phone'}
        ]);
        
        helper.fetchContacts(component);
    }
})