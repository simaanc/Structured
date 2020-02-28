package javafx;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
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
        Stage controlsStage = new Stage();
        Dimension screenSize = Toolkit.getDefaultToolkit().getScreenSize();


        System.out.println("This should be working");
        System.out.println(Controller.class.getResource("/ProcessingFX.fxml"));
        Parent root = FXMLLoader.load(Controller.class.getResource("/ProcessingFX.fxml"));
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