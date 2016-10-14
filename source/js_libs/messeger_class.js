/*
 * Класс коллкция методов для общения с сервером
 */

function Messager()
{
}

Messager.prototype.GetData = function ( file )
{
    var xhr = new XMLHttpRequest();
    xhr.open('Post', file, false); //sync

    xhr.send(null);
    
    if (xhr.status != 200)
    {
        alert('Error' + xhr.status + ': ' + xhr.statusText);
        return;
    }
    
    return xhr.responseText; 
};

Messager.prototype.SetData = function ( cmd, data )
{
    var xhr = new XMLHttpRequest();
    xhr.open( 'Post', cmd, false ); //sync

    xhr.send(data);
    
    if (xhr.status != 200 )
    {
        alert( 'Error' + xhr.status + ': ' + xhr.statusText );
        return;
    }
    
    return xhr.responseText; 
};

Messager.prototype.GetObjectsListFromFile = function( obj_list , file , constr )
{
    var data = this.GetData( file );
    
    data = data.toString().split(";");

    for( var i = 0; i < data.length; i++ )
    {
        let tmp = JSON.parse( data[i] );
        tmp = new constr( tmp );
        obj_list.push( tmp );
    }
};

Messager.prototype.AppendNewRecipt = function( new_recip )
{
    this.SetData( "/add_recip" , new_recip );
};

Messager.prototype.AppendNewProd = function( new_prod )
{
    this.SetData( "/add_prod" , new_prod );
};

Messager.prototype.GetObjectsStore = function( obj_store_l )
{
    this.GetObjectsListFromFile( obj_store_l,
                                    "objects/obj_list.json",
                                    ProductInStore);
};

Messager.prototype.GetObjectsRecips = function( )
{
    var rcips_l = [];
    
    this.GetObjectsListFromFile( rcips_l, "objects/reciep_list.json", Recip);
    
    return rcips_l;
};