import { roles } from "../config/roles.json";

class Role {
    constructor() {
        this.roles = roles.roles;
    }

    getRolesByName(name) {
        return this.roles.find((role) => role.name === name);
    }

    getRoles() {
        return this.roles;
    }
}

module.exports = Role;