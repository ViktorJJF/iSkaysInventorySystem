import Vue from 'vue';
import {
    required,
    email,
    max
} from "vee-validate/dist/rules";
import {
    extend
} from "vee-validate";
import {
    ValidationObserver,
    ValidationProvider
} from "vee-validate";
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);

extend("required", {
    ...required,
    message: "Este campo es requerido"
});

extend("max", {
    ...max,
    message: "This field must be {length} characters or less"
});

extend("email", {
    ...email,
    message: "Este campo debe ser un email"
});