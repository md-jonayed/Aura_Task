public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts() {
        return [
            SELECT Id, Name, Email, Phone, Fax
            FROM Contact
            LIMIT 50
        ];
    }
}