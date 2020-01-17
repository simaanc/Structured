package javafx;

import de.codecentric.centerdevice.MenuToolkit;
import javafx.application.Application;

import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Menu;
import javafx.scene.control.MenuBar;
import javafx.scene.control.MenuItem;
import javafx.scene.control.SeparatorMenuItem;
import javafx.stage.Stage;
import processing.Structured;
import processing.javafx.PSurfaceFX;

import java.awt.*;

public class App extends Application {

    public static PSurfaceFX surface;
    public static Structured p;
    static final String appName = "Structured";


    @Override
    public void start(Stage primaryStage) throws Exception {

        MenuToolkit tk = MenuToolkit.toolkit();

        MenuBar bar = new MenuBar();

        // Application Menu
        // TBD: services menu
        Menu appMenu = new Menu(appName); // Name for appMenu can't be set at
        // Runtime
        MenuItem aboutItem = tk.createAboutMenuItem(appName);
        MenuItem prefsItem = new MenuItem("Preferences...");
        appMenu.getItems().addAll(aboutItem, new SeparatorMenuItem(), prefsItem, new SeparatorMenuItem(),
                tk.createHideMenuItem(appName), tk.createHideOthersMenuItem(), tk.createUnhideAllMenuItem(),
                new SeparatorMenuItem(), tk.createQuitMenuItem(appName));

        // File Menu (items TBD)
        Menu fileMenu = new Menu("File");
        MenuItem newItem = new MenuItem("New...");
        fileMenu.getItems().addAll(newItem, new SeparatorMenuItem(), tk.createCloseWindowMenuItem(),
                new SeparatorMenuItem(), new MenuItem("TBD"));

        // Edit (items TBD)
        Menu editMenu = new Menu("Edit");
        editMenu.getItems().addAll(new MenuItem("TBD"));

        // Format (items TBD)
        Menu formatMenu = new Menu("Format");
        formatMenu.getItems().addAll(new MenuItem("TBD"));

        // View Menu (items TBD)
        Menu viewMenu = new Menu("View");
        viewMenu.getItems().addAll(new MenuItem("TBD"));

        // Window Menu
        // TBD standard window menu items
        Menu windowMenu = new Menu("Window");
        windowMenu.getItems().addAll(tk.createMinimizeMenuItem(), tk.createZoomMenuItem(), tk.createCycleWindowsItem(),
                new SeparatorMenuItem(), tk.createBringAllToFrontItem());

        // Help Menu (items TBD)
        Menu helpMenu = new Menu("Help");
        helpMenu.getItems().addAll(new MenuItem("TBD"));

        bar.getMenus().addAll(appMenu, fileMenu, editMenu, formatMenu, viewMenu, windowMenu, helpMenu);


        Stage controlsStage = new Stage();
        Dimension screenSize = Toolkit.getDefaultToolkit().getScreenSize();

        FXMLLoader loader = new FXMLLoader(getClass().getClassLoader().getResource("ProcessingFX.fxml"));

        Parent root = loader.load();
        Controller.stage = controlsStage;
        Scene scene = new Scene(root, screenSize.getWidth(), screenSize.getHeight());

        primaryStage.setTitle("Structured");
        primaryStage.setScene(scene);
        primaryStage.show();

        //tk.setMenuBar(primaryStage, bar);


        surface.stage = primaryStage;
        Controller.stage = controlsStage;
    }
}
