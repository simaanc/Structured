package javafx;

import com.jfoenix.controls.JFXButton;
import com.jfoenix.controls.JFXSlider;
import com.jfoenix.controls.JFXToggleButton;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.canvas.Canvas;
import javafx.scene.control.ColorPicker;
import javafx.scene.control.Label;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.StackPane;
import javafx.scene.paint.Color;
import javafx.scene.shape.Rectangle;
import javafx.stage.Stage;
import processing.Structured;
import processing.javafx.PSurfaceFX;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URL;
import java.util.Properties;
import java.util.ResourceBundle;

/**
 * Communicates JavaFX events back to the running PApplet
 */
@SuppressWarnings("ALL")
public class Controller implements Initializable {

    public static PSurfaceFX surface;
    public static Structured p;
    protected static Stage stage;

    public JFXToggleButton t_ogen;

    @FXML
    AnchorPane superParent;
    @FXML
    JFXSlider s_alpha, s_complexity, s_stroke, s_gen, s_axiom, s_scatter, s_zoom, s_lerp, s_maxs, s_mins, s_widthr, s_heightr;
    @FXML
    StackPane processing;
    @FXML
    ColorPicker colorPicker;
    @FXML
    Label v_l_alpha, v_l_complexity, v_l_stroke, v_l_gen, v_l_axiom, v_l_scatter, v_l_zoom, v_l_lerp, v_l_maxs, v_l_mins, v_l_widthr, v_l_heightr;
    @FXML
    JFXToggleButton t_line, t_square, t_circle, t_triangle, t_hexagon, t_cube, t_squaref, t_circlef, t_trianglef, t_hexagonf, t_cubef, t_ratiol, t_sizel;
    @FXML
    JFXButton b_defaultc, b_generate, b_save;
    @FXML
    Rectangle r_preview;

    //private File macDatadir = new File(System.getProperty("user.home") + "/Library/" + "Structured");
    //private File lastUsedValuesTXT = new File(macDatadir + File.separator + "Data" + File.separator + "lastusedvalues.txt");

    @Override
    public void initialize(URL location, ResourceBundle resources) {

        Canvas canvas = (Canvas) surface.getNative();
        surface.fx.context = canvas.getGraphicsContext2D();
        processing.getChildren().add(canvas);
        canvas.widthProperty().bind(processing.widthProperty());
        canvas.heightProperty().bind(processing.heightProperty());


//Set Values
        s_alpha.valueProperty().addListener((observable, oldValue, newValue) -> {
            p.alpha = (int) Math.round(newValue.doubleValue());
            v_l_alpha.setText(String.valueOf(Math.round(newValue.doubleValue())));
            processing.requestFocus();
        });
        s_complexity.valueProperty().addListener((observable, oldValue, newValue) -> {
            p.complexity = (int) Math.round(newValue.doubleValue());
            v_l_complexity.setText(String.valueOf(Math.round(newValue.doubleValue())));
            processing.requestFocus();
        });
        s_stroke.valueProperty().addListener((observable, oldValue, newValue) -> {
            p.stroke = (int) Math.round(newValue.doubleValue());
            v_l_stroke.setText(String.valueOf(Math.round(newValue.doubleValue())));
            processing.requestFocus();
        });
        s_gen.valueProperty().addListener((observable, oldValue, newValue) -> {
            p.gens = (int) Math.round(newValue.doubleValue());
            v_l_gen.setText(String.valueOf(Math.round(newValue.doubleValue())));
            processing.requestFocus();
        });
        s_axiom.valueProperty().addListener((observable, oldValue, newValue) -> {
            p.axiomAmount = (int) Math.round(newValue.doubleValue());
            v_l_axiom.setText(String.valueOf(Math.round(newValue.doubleValue())));
        });
        s_scatter.valueProperty().addListener((observable, oldValue, newValue) -> {
            p.scatter = (int) Math.round(newValue.doubleValue());
            v_l_scatter.setText(String.valueOf(Math.round(newValue.doubleValue())));
        });
        s_zoom.valueProperty().addListener((observable, oldValue, newValue) -> {
            p.size = (int) Math.round(newValue.doubleValue());
            v_l_zoom.setText(String.valueOf(Math.round(newValue.doubleValue())));
        });
        s_lerp.valueProperty().addListener((observable, oldValue, newValue) -> {
            p.lerpFrequency = (int) Math.round(newValue.doubleValue());
            v_l_lerp.setText(String.valueOf(Math.round(newValue.doubleValue())));
        });
        s_maxs.valueProperty().addListener((observable, oldValue, newValue) -> {
            p.maxSizeMultiplier = (Math.round(newValue.doubleValue()) / 100);
            v_l_maxs.setText(String.valueOf((Math.round(newValue.doubleValue()))));
        });
        s_mins.valueProperty().addListener((observable, oldValue, newValue) -> {
            p.minSizeMultiplier = (Math.round(newValue.doubleValue()) / 100);
            v_l_mins.setText(String.valueOf((Math.round(newValue.doubleValue()))));
        });
        s_widthr.valueProperty().addListener((observable, oldValue, newValue) -> {
            p.widthRatio = (int) Math.round(newValue.doubleValue());
            v_l_widthr.setText(String.valueOf(Math.round(newValue.doubleValue())));
        });
        s_heightr.valueProperty().addListener((observable, oldValue, newValue) -> {
            p.heightRatio = (int) Math.round(newValue.doubleValue());
            v_l_heightr.setText(String.valueOf(Math.round(newValue.doubleValue())));
        });
        t_line.selectedProperty().addListener(((observable, oldValue, newValue) -> {
            p.toggleLine = newValue;
        }));
        t_square.selectedProperty().addListener(((observable, oldValue, newValue) -> {
            p.toggleSquare = newValue;
        }));
        t_circle.selectedProperty().addListener(((observable, oldValue, newValue) -> {
            p.toggleCircle = newValue;
        }));
        t_triangle.selectedProperty().addListener(((observable, oldValue, newValue) -> {
            p.toggleTriangle = newValue;
        }));
        t_hexagon.selectedProperty().addListener(((observable, oldValue, newValue) -> {
            p.toggleHex = newValue;
        }));
        t_cube.selectedProperty().addListener(((observable, oldValue, newValue) -> {
            p.toggleCube = newValue;
        }));
        t_squaref.selectedProperty().addListener(((observable, oldValue, newValue) -> {
            p.toggleSquareFill = newValue;
        }));
        t_circlef.selectedProperty().addListener(((observable, oldValue, newValue) -> {
            p.toggleCircleFill = newValue;
        }));
        t_trianglef.selectedProperty().addListener(((observable, oldValue, newValue) -> {
            p.toggleTriangleFill = newValue;
        }));
        t_hexagonf.selectedProperty().addListener(((observable, oldValue, newValue) -> {
            p.toggleHexFill = newValue;
        }));
        t_cubef.selectedProperty().addListener(((observable, oldValue, newValue) -> {
            p.toggleCubeFill = newValue;
        }));

        colorPicker.setOnAction((ActionEvent e) -> {
            p.startShapeR = (int) Math.round(colorPicker.getValue().getHue());
            p.startShapeG = (int) Math.round(colorPicker.getValue().getSaturation());
            p.startShapeB = (int) Math.round(colorPicker.getValue().getBrightness());
            p.opacity = (int) Math.round(colorPicker.getValue().getOpacity());

            r_preview.setFill(Color.hsb(colorPicker.getValue().getHue(), colorPicker.getValue().getSaturation(), colorPicker.getValue().getBrightness(), colorPicker.getValue().getOpacity()));
        });

        t_ratiol.selectedProperty().addListener(((observable, oldValue, newValue) -> {
            s_heightr.valueProperty().set(s_widthr.getValue());
        }));
        t_sizel.selectedProperty().addListener(((observable, oldValue, newValue) -> {
            s_maxs.valueProperty().set(s_mins.getValue());
        }));

        b_generate.setOnAction(new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent event) {
                p.onGenerate();

                //Reading properties files in Java example
                Properties props = new Properties();
                FileOutputStream fos = null;
                try {
                    fos = new FileOutputStream(p.macDatadir + File.separator + "Data" + File.separator + "lastusedvalues.xml");
                } catch (FileNotFoundException e) {
                    e.printStackTrace();
                }

                props.setProperty("Alpha", String.valueOf(p.alpha));
                props.setProperty("Complexity", String.valueOf(p.complexity));
                props.setProperty("Stroke", String.valueOf(p.stroke));
                props.setProperty("Gen", String.valueOf(p.gens));
                props.setProperty("Axiom", String.valueOf(p.axiomAmount));
                props.setProperty("Scatter", String.valueOf(p.scatter));
                props.setProperty("Zoom", String.valueOf(p.size));
                props.setProperty("LineToggle", String.valueOf(p.toggleLine));
                props.setProperty("SquareToggle", String.valueOf(p.toggleSquare));
                props.setProperty("CircleToggle", String.valueOf(p.toggleCircle));
                props.setProperty("TriangleToggle", String.valueOf(p.toggleTriangle));
                props.setProperty("HexagonToggle", String.valueOf(p.toggleHex));
                props.setProperty("CubeToggle", String.valueOf(p.toggleCube));
                props.setProperty("SquareToggleFill", String.valueOf(p.toggleSquareFill));
                props.setProperty("CircleToggleFill", String.valueOf(p.toggleCircleFill));
                props.setProperty("TriangleToggleFill", String.valueOf(p.toggleTriangleFill));
                props.setProperty("HexagonToggleFill", String.valueOf(p.toggleHexFill));
                props.setProperty("CubeToggleFill", String.valueOf(p.toggleCubeFill));
                props.setProperty("Lerp", String.valueOf(p.lerpFrequency));
                props.setProperty("Color Red", String.valueOf(p.startShapeR));
                props.setProperty("Color Green", String.valueOf(p.startShapeG));
                props.setProperty("Color Blue", String.valueOf(p.startShapeB));
                props.setProperty("Max Size", String.valueOf(p.maxSizeMultiplier));
                props.setProperty("Min Size", String.valueOf(p.minSizeMultiplier));
                props.setProperty("Width Ratio", String.valueOf(p.widthRatio));
                props.setProperty("Height Ratio", String.valueOf(p.widthRatio));
                props.setProperty("Ratio Link", String.valueOf(t_ratiol.isSelected()));
                props.setProperty("Size Link", String.valueOf(t_sizel.isSelected()));

                //writing properites into properties file from Java
                try {
                    props.storeToXML(fos, "Last Used Values From the Structured App");
                } catch (IOException e) {
                    e.printStackTrace();
                }

                try {
                    fos.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }


            }

        });


        b_save.setOnAction(new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent event) {
                p.onSave();
            }
        });

/*        try {
            File fXmlFile = new File(p.macDatadir + File.separator + "Data" + File.separator + "lastusedvalues.xml");
            DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
            Document doc = dBuilder.parse(fXmlFile);

            doc.getDocumentElement().normalize();

            NodeList nList = doc.getElementsByTagName("properties");

            for (int temp = 0; temp < nList.getLength(); temp++) {

                Node nNode = nList.item(temp);

                System.out.println("\nCurrent Element :" + nNode.getNodeName());

                if (nNode.getNodeType() == Node.ELEMENT_NODE) {

                    Element eElement = (Element) nNode;

                    System.out.println("Alpha: " + eElement.getAttribute("Alpha"));
                    System.out.println("Complexity: " + eElement.getElementsByTagName("Complexity").item(0).getTextContent());
                    System.out.println("Stroke: " + eElement.getElementsByTagName("Stroke").item(0).getTextContent());
                    System.out.println("Gen: " + eElement.getElementsByTagName("Gen").item(0).getTextContent());
                    System.out.println("Axiom: " + eElement.getElementsByTagName("Axiom").item(0).getTextContent());

                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }*/
    }

    @FXML
    private void exit() {
        stage.close();
    }

    @FXML
    private void clearCanvas() {
        p.redraw();
    }
}
