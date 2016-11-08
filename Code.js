//Directory Tree Generator Function
var version = 'v2.2.1'
/* Version history:
 * v2.2.1:
 *   Fix accidental file deletion
 *
 * v2.2:
 *   Rewrote Directory walking for Lexicographical Organization
 *
 * v2.1:
 *   Changed text document Generation to Google Doc Generation
 *
 * v2.0
 *   Converted Script to GoogleScript
 *   Made to run automatically on google drive
 *
 * v1.0:
 *   Python Script that ran in synced google drive folder
 */
function onTime() {
    var mdir = DriveApp.getRootFolder();                               //Drive root Directory
    var odir = DriveApp.getFolderById("0B2lNnNYG8-MreFhYWnltYmNTZTQ"); //Output Directory
    var sdir = DriveApp.getFolderById("0B7Zx326vcGL1MUhheEppcHYzaGs"); //script Directory

    var outFnlName = "00 Lost? Click Here!";
    var d = new Date()
    var humbleBrag = 'Welcome to the Directory Structure ' + version + '! \nThis file is updated every hour. \nCtrl+F is your friend :^)\n\n'
    var update = "Last Updated: " + d.toLocaleString() + "\n\n"
    var blob = Utilities.newBlob(humbleBrag + update);
    dirWalk(blob, odir, 0)

    //delete previous files in drive
    var delFiles = odir.getFilesByName(outFnlName)
    while (delFiles.hasNext()) {
        var elem = delFiles.next();
        deleteFile(elem.getId());
    }

    //delete files from my drive added by google docs
    var delFiles = mdir.getFilesByName(outFnlName)
    while (delFiles.hasNext()) {
        var elem = delFiles.next();
        deleteFile(elem.getId());
    }

    //var outFnl = rdir.createFile(blob.setName(outFnlName));
    var doc = DocumentApp.create(outFnlName);
    odir.addFile(DriveApp.getFileById(doc.getId()));
    var docbody = doc.getBody();
    docbody.setText(blob.getDataAsString());
}

function dirWalk(blob, folder, depth) {
    // IDEA:
    // recursvely get folders and add them to the list
    // then add all files in that Directory
    // back out of that folder and start on the next
    // keep track of how deep you are to manage the indentation

    append(blob, space(depth) + "  " + folder.getName());
    var subFolders = itertoarr(folder.getFolders());
    subFolders = subFolders.sort(
        function(a, b){
            var nameA=a.getName().toLowerCase(), nameB=b.getName().toLowerCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0; //default return value (no sorting)
        }
    );
    subFolders.forEach(function (item, index, array) {
        dirWalk(blob, item, depth + 1)
    });

    var subFiles = itertoarr(folder.getFiles());
    subFiles = subFiles.sort(
        function(a, b){
            var nameA=a.getName().toLowerCase(), nameB=b.getName().toLowerCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0; //default return value (no sorting)
        }
    );
    subFiles.forEach(function (item, index, array) {
        append(blob, space(depth + 1) + "- " + item.getName());
    });
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

function itertoarr(FolderIter) {
    var result = [];
    while (FolderIter.hasNext()) {
        result.push(FolderIter.next());
    }
    return result;
}

function makeIterator(array){
    var nextIndex = 0;

    return {
       next: function(){
           return nextIndex < array.length ?
               {value: array[nextIndex++], done: false} :
               {done: true};
       }
    }
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