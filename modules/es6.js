/**
 * Created by liwenqian on 2017/3/9.
 */

let too = "bar";
let fun = () => {
    too += "hello world";
    console.log(too);
    return too;

};
fun();