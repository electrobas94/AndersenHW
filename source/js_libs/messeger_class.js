function Messager()
{
}

Messager.prototype.GetData = function ( file )
{
    var xhr = new XMLHttpRequest();
    xhr.open('GET', file, false); //sync
    xhr.send(null);
    
    if (xhr.status != 200)
    {
        alert('Error' + xhr.status + ': ' + xhr.statusText);
        return;
    }
    
    return xhr.responseText; 
};

Messager.prototype.GetObjectsListFromFile = function( obj_list , file , constr )
{
    var data = this.GetData( file );
    
    data = data.toString().split(";");

    for(var i = 0; i < data.length; i++ )
    {
        var tmp = JSON.parse( data[i] );
        tmp = new constr(tmp);
        obj_list.push(tmp);
    }
};

Messager.prototype.GetObjectsStore = function( obj_store_list )
{
    this.GetObjectsListFromFile( obj_store_list, "objects/obj_list.json", ProductInStore);
};

Messager.prototype.GetObjectsRecips = function( )
{
    var rcips_list = [];
    this.GetObjectsListFromFile( rcips_list, "objects/reciep_list.json", Recip);
    
    return rcips_list;
};