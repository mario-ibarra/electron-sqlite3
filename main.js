const { app, BrowserWindow, ipcMain, Menu } = require('electron');

// Set Env
process.env.NODE_ENV = 'production';

let mainWindow;

app.on("ready", () => {
    mainWindow = new BrowserWindow({
      width: 1400,
      height: 900,
      title:"All In One",
      center: true,
      show: false,
      webPreferences: {
              nodeIntegration: true,
              contextIsolation: false
          }

  });

//  mainWindow.webContents.openDevTools()

  mainWindow.loadURL(`file://${__dirname}/index.html`)
  mainWindow.once("ready-to-show", () => {mainWindow.show()})

// Build menu from template
const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
// insert menu
Menu.setApplicationMenu(mainMenu);

//Info from database
  const {add, listAll, findByName, update, remove}  = require('./models/dbHelpers.js')


  ipcMain.on("mainWindowLoaded",  () => {
    let resultList = listAll()
      resultList.then(function(customerList){
        mainWindow.webContents.send("list:customers", customerList)
      }); 
    });
    // Recieve data to add customer
    ipcMain.on('add:customer', (event, data) =>{
      add(data)
      event.sender.send('add:customer', ' Customer Created!!!')

    })

    // Recieve data to delete customer
    ipcMain.on('delete:customer', (event, id) =>{
      remove(id);
      event.sender.send('deleted:customer-database', 'Customer Deleted!!')
    })

    // Update customer
    ipcMain.on('edit:customer', (event, id, data) =>{
      update(id, data);
      event.sender.send('Update:customer-database', ' Customer Updated!')
    })

  }); // App ready & create window

const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Quit',
        click(){
          app.quit();
        }
      }
    ]
  }
]


app.on("window-all-closed", () => {app.quit()})

