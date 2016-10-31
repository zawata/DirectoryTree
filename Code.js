//Google Script File

function onStart() {
    var rdir = DriveApp.getFolderById("0B2lNnNYG8-MreFhYWnltYmNTZTQ"); //root Directory
    var outFnlName = "00 Lost? Click Here! v2.txt";
    var d = new Date()
    var update = "Last Updated: " + d.toLocaleString() + "\n"
    var humbleBrag = 'Welcome to the Directory Structure 2.0! \nThis file is updated every 2 hours.(pending) \nCtrl+F is your friend :^)\n\n'
    var blob = Utilities.newBlob(update + humbleBrag);
    dirWalk(blob, rdir, 0)

    var delFiles = rdir.getFilesByName(outFnlName)
    while (delFiles.hasNext()) {
        var elem = delFiles.next();
        deleteFile(elem.getId());
    }
    var outFnl = rdir.createFile(blob.setName(outFnlName));
}

function dirWalk(blob, folder, depth) {
    // IDEA:
    // recursvely get folders and add them to the list
    // then add all files in that Directory
    // back out of that folder and start on the next
    // keep track of how deep you are to manage the indentation

    append(blob, space(depth) + "• " + folder.getName());
    var subFolders = folder.getFolders();
    while (subFolders.hasNext()) {
        var elem = subFolders.next();
        dirWalk(blob, elem, depth + 1)
    }
    var subFiles = folder.getFiles();
    while (subFiles.hasNext()) {
        var file = subFiles.next();
        append(blob, space(depth + 1) + "- " + file.getName());
    }
}

//              //
// Dependencies //
//              //

function space(level) {
    // generate spaces for indentation (level*4)
    var retval = '';
    for (var i = 0; i < level; i++) {
        retval += "    ";
    }
    return retval;
}

function append(blob, str) {
    // append the given string as a new line in the blob
    return blob.setDataFromString(blob.getDataAsString() + str + '\n');
}

function deleteFile(fileID) {
    // Hard deletes a file. Does NOT move it to trash or out of the Folder
    // File Gets Stright up Axed Yo
    // http://stackoverflow.com/questions/14241237/google-apps-script-how-to-delete-a-file-in-google-drive
    return Drive.Files.remove(fileID);
}
