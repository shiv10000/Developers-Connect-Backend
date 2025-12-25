function parent(message){
    this.message = message+1

}

function children(myMessage){
    this.myMessage = myMessage
    parent.call(this,myMessage);
}

Object.setPrototypeOf(children,parent)


const mess = new children(2)
