<template>
    <table v-if="!loading" class="table table-hover table-striped test-data">
        <tbody>
            <tr v-for="item in rows" :key="item.id">
                <td class="col-md-1">{{item.id}}</td>
                <td class="col-md-4">
                    <a>{{item.label}}</a>
                </td>
                <td class="col-md-1">
                    <a>
                        <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                    </a>
                </td>
                <td class="col-md-6"></td>
            </tr>
        </tbody>
    </table>
    <span v-else>loading</span>
</template>

<script>
import { bindState } from 'xsm';

export default {
    created() {
        bindState(this,{loading: false, rows: []});
    },
}
</script>
