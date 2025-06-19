<aura:application extends="force:slds" access="global">
    <!-- Connect Button -->
    <div style="margin-bottom: 20px;">
        <c:ConnectApp/>
    </div>

    <!-- Connected Data Table -->
    <!--
    <div style="margin-bottom: 40px;">
        <c:ConnectedDataComponent/>
    </div>
	-->
    <!-- 3 Component Tables Side-by-Side -->
    <div style="display: flex; flex-direction: row; justify-content: space-between; gap: 20px;">
        <div style="flex: 1;">
            <c:AccountComponent/>
        </div>
        <div style="flex: 1;">
            <c:ContactComponent/>
        </div>
        <div style="flex: 1;">
            <c:OpportunityComponent/>
        </div>
    </div>

</aura:application>