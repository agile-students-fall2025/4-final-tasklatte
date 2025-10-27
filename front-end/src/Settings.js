const Settings = () => {
    <h1>Settings</h1>;
    <h4>Profile:</h4>;
    <label>
        <input name="myInput" defaultValue="Bio"/>
        <button class="edit-button" type="button">Edit</button>
    </label>;
    <label>
        <input name="myInput" defaultValue="Major"/>
        <button class="edit-button" type="button">Edit</button>

    </label>;
    <label>
        <input name="myInput" defaultValue="School"/>
        <button class="edit-button" type="button">Edit</button>

    </label>;
    <label>
        <input name="myInput" defaultValue="Time-zone"/>
        <button class="edit-button" type="button">Edit</button>

    </label>;
    <label>
        <input name="myInput" defaultValue="Goals"/>
        <button class="edit-button" type="button">Edit</button>
    </label>;

    <h4>Other:</h4>;
    <button class="logout-button" type="button">Log Out</button>;
    <button class="delete-button" type="button">Delete Account</button>


    function SettingsButton() {
        return (
            <button>Settings</button>
        );
    }
}

export default Settings