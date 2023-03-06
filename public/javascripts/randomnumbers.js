function randomStringToInput(clicked_element)
{
    var self = $(clicked_element);
    var random_string = generateRandomString(5);
    $('input[name=id1]').val(random_string);
    self.remove();
}
function generateRandomString(string_length)
{
    var characters = '0123456789';
    var string = '';
    for(var i = 0; i <= string_length; i++)
    {
        var rand = Math.round(Math.random() * (characters.length - 1));
        var character = characters.substr(rand, 1);
        string = string + character;
    }
    return string;

}
