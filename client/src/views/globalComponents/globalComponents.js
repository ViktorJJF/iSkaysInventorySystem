import Vue from "vue";
import customCard from './customCard';
import toolbar from './toolbar';
import drawer from './drawer';
import snackbar from './snackbar';
import overlay from './overlay';
import Card from '../../components/material/Card'
import offset from '../../components/helper/Offset';
import ChartCard from '../../components/material/ChartCard'
import Notification from '../../components/material/Notification'
import StatsCard from '../../components/material/StatsCard'
Vue.component('customCard', customCard);
Vue.component('toolbar', toolbar);
Vue.component('drawer', drawer);
Vue.component('snackbar', snackbar);
Vue.component('overlay', overlay);
Vue.component(Card.name, Card);
Vue.component(offset.name, offset);
Vue.component(ChartCard.name, ChartCard);
Vue.component(Notification.name, Notification);
Vue.component(StatsCard.name, StatsCard);