<template>
    <div class="container">
        <div class="jumbotron">
            <div class="row">
                <div class="col-md-6">
                    <h1>Vue+XSM</h1>
                </div>
                <div class="col-md-6">
                    <div class="row">
                        <div class="col-sm-6 smallpad">
                          <button type="button" class="btn btn-primary btn-block" id="sync" v-on:click="syncrow">Create a row synchronously</button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button type="button" class="btn btn-primary btn-block" id="async" v-on:click="asyncrow">Create a row asynchronously</button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button type="button" class="btn btn-primary btn-block" id="clear" v-on:click="clear">Clear</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <mytable></mytable>
    </div>
</template>

<script>
import mytable from './table.vue';
import { setcfg, set, setMany } from 'xsm';

setcfg({framework: 'Vue'});

export default {
    components: {
        mytable,
    },
    methods: {
        syncrow(e) {
            set('rows', [{id: 1, label: 'this is a sync apple'}]);
        },
        asyncrow(e) {
            set('loading', true);
            setTimeout(() => {setMany({loading: false, rows: [{id: 1, label: 'this is an async apple'}]})}, 1000);
        },
        clear() {
            setMany({rows: [], loading: false})
        }
    }
}
</script>
