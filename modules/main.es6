import "babel-polyfill";

import {greet} from './hello';

greet('Scott').then((greeting) => {
    document.getElementById('container').innerHTML += greeting;
});

document.getElementById('container').innerHTML = 'I am greeting: ';