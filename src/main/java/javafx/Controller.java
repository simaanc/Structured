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

import java.io.*;
import java.net.URL;
import java.text.DecimalFormat;
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

    public boolean Startup = false;


    @FXML
    public JFXToggleButton t_ogen;
    @FXML
    public AnchorPane superParent;
    @FXML
    public JFXSlider s_alpha, s_complexity, s_stroke, s_gen, s_axiom, s_scatter, s_zoom, s_lerp, s_maxs, s_mins, s_widthr, s_heightr;
    @FXML
    public StackPane processing;
    @FXML
    public ColorPicker colorPicker;
    @FXML
    public Label v_l_alpha, v_l_complexity, v_l_stroke, v_l_gen, v_l_axiom, v_l_scatter, v_l_zoom, v_l_lerp, v_l_maxs, v_l_mins, v_l_widthr, v_l_heightr;
    @FXML
    public JFXToggleButton t_line, t_square, t_circle, t_triangle, t_hexagon, t_cube, t_squaref, t_circlef, t_trianglef, t_hexagonf, t_cubef, t_ratiol, t_sizel;
    @FXML
    public JFXButton b_defaultc, b_generate, b_save;
    @FXML
    public Rectangle r_preview;

    private static DecimalFormat df = new DecimalFormat("0.00");
    //private File macDatadir = new File(System.getProperty("user.home") + "/Library/" + "Structured");
    //private File lastUsedValuesTXT = new File(macDatadir + File.separator + "Data" + File.separator + "lastusedvalues.txt");

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        Canvas canvas = (Canvas) surface.getNative();
        surface.fx.context = canvas.getGraphicsContext2D();
        processing.getChildren().add(canvas);
        canvas.widthProperty().bind(processing.widthProperty());
        canvas.heightProperty().bind(processing.heightProperty());

        Properties prop = new Properties();
        try {
            prop.loadFromXML(new FileInputStream(System.getProperty("user.home") + "/Library/" + "Structured" + File.separator + "Data" + File.separator + "lastusedvalues.xml"));
        } catch (IOException e) {
            e.printStackTrace();
        }

//Set Values
        s_alpha.valueProperty().setValue(Double.parseDouble(prop.getProperty("Alpha")));
        v_l_alpha.setText(String.valueOf(Math.round(Float.parseFloat(prop.getProperty("Alpha")))));
        s_alpha.valueProperty().addListener((observable, oldValue, newValue) -> {
            p.alpha = newValue.intValue();
            v_l_alpha.setText(String.valueOf(Math.round(newValue.doubleValue())));
            processing.requestFocus();
        });

        s_complexity.valueProperty().setValue(Double.parseDouble(prop.getProperty("Complexity")));
        v_l_complexity.setText(String.valueOf(Math.round(Float.parseFloat(prop.getProperty("Complexity")))));
        s_complexity.valueProperty().addListener((observable, oldValue, newValue) -> {
            p.complexity = newValue.intValue();
            v_l_complexity.setText(String.valueOf(Math.round(newValue.doubleValue())));
            processing.requestFocus();
        });

        s_stroke.valueProperty().setValue(Double.parseDouble(prop.getProperty("Stroke")));
        v_l_stroke.setText(String.valueOf(Math.round(Float.parseFloat(prop.getProperty("Stroke")))));
        s_stroke.valueProperty().addListener((observable, oldValue, newValue) -> {
            p.stroke = newValue.intValue();
            v_l_stroke.textProperty().setValue(String.valueOf(newValue.intValue()));
            processing.requestFocus();
        });

        s_gen.valueProperty().setValue(Double.parseDouble(prop.getProperty("Gen")));
        v_l_gen.setText(String.valueOf(Math.round(Float.parseFloat(prop.getProperty("Gen")))));
        s_gen.valueProperty().addListener((observable, oldValue, newValue) -> {
            p.gens = newValue.intValue();
            v_l_gen.textProperty().setValue(String.valueOf(newValue.intValue()));
            processing.requestFocus();
        });

        s_axiom.valueProperty().setValue(Double.parseDouble(prop.getProperty("Axiom")));
        v_l_axiom.setText(String.valueOf(Math.round(Float.parseFloat(prop.getProperty("Axiom")))));
        s_axiom.valueProperty().addListener((observable, oldValue, newValue) -> {
            p.axiomAmount = newValue.intValue();
            v_l_axiom.setText(String.valueOf(Math.round(newValue.doubleValue())));
        });

        s_scatter.valueProperty().setValue(Double.parseDouble(prop.getProperty("Scatter")));
        v_l_scatter.setText(String.valueOf(Math.round(Float.parseFloat(prop.getProperty("Scatter")))));
        s_scatter.valueProperty().addListener((observable, oldValue, newValue) -> {
            p.scatter = newValue.intValue();
            v_l_scatter.setText(String.valueOf(Math.round(newValue.doubleValue())));
        });

        s_zoom.valueProperty().setValue(Double.parseDouble(prop.getProperty("Zoom")));
        v_l_zoom.setText(String.valueOf(Math.round(Float.parseFloat(prop.getProperty("Zoom")))));
        s_zoom.valueProperty().addListener((observable, oldValue, newValue) -> {
            p.size = newValue.intValue();
            v_l_zoom.setText(String.valueOf(Math.round(newValue.doubleValue())));
        });

        s_lerp.valueProperty().setValue(Double.parseDouble(prop.getProperty("Lerp")));
        v_l_lerp.setText(String.valueOf(Math.round(Float.parseFloat(prop.getProperty("Lerp")))));
        s_lerp.valueProperty().addListener((observable, oldValue, newValue) -> {
            p.lerpFrequency = newValue.intValue();
            v_l_lerp.setText(String.valueOf(Math.round(newValue.doubleValue())));
        });

        s_maxs.valueProperty().setValue((Double.parseDouble(prop.getProperty("MaxSize"))) * 100);
        v_l_maxs.setText(String.valueOf(Math.round(Float.parseFloat((prop.getProperty("MaxSize"))) * 100)));
        s_maxs.valueProperty().addListener((observable, oldValue, newValue) -> {
            p.maxSizeMultiplier = (float) (Math.round(newValue.doubleValue()) / 100.0);
            v_l_maxs.setText(String.valueOf((Math.round(newValue.doubleValue()))));
        });

        s_mins.valueProperty().setValue((Double.parseDouble(prop.getProperty("MinSize"))) * 100);
        v_l_mins.setText(String.valueOf(Math.round(Float.parseFloat((prop.getProperty("MinSize"))) * 100)));
        s_mins.valueProperty().addListener((observable, oldValue, newValue) -> {
            p.minSizeMultiplier = (float) (Math.round(newValue.doubleValue()) / 100.0);
            v_l_mins.setText(String.valueOf((Math.round(newValue.doubleValue()))));
        });

        s_widthr.valueProperty().setValue((Double.parseDouble(prop.getProperty("WidthRatio"))) * 100);
        v_l_widthr.setText(String.valueOf(Math.round(Float.parseFloat((prop.getProperty("WidthRatio"))) * 100)));
        s_widthr.valueProperty().addListener((observable, oldValue, newValue) -> {
            p.widthRatio = (float) (Math.round(newValue.doubleValue()) / 100.0);
            v_l_widthr.setText(String.valueOf(Math.round(newValue.doubleValue())));
        });

        s_heightr.valueProperty().setValue((Double.parseDouble(prop.getProperty("HeightRatio"))) * 100);
        v_l_heightr.setText(String.valueOf(Math.round(Float.parseFloat((prop.getProperty("HeightRatio"))) * 100)));
        s_heightr.valueProperty().addListener((observable, oldValue, newValue) -> {
            p.heightRatio = (float) (Math.round(newValue.doubleValue()) / 100.0);
            v_l_heightr.setText(String.valueOf(Math.round(newValue.doubleValue())));
        });

        t_line.selectedProperty().setValue(Boolean.valueOf(prop.getProperty("LineToggle")));
        t_line.selectedProperty().addListener(((observable, oldValue, newValue) -> {
            p.toggleLine = newValue;
        }));

        t_square.selectedProperty().setValue(Boolean.valueOf(prop.getProperty("SquareToggle")));
        t_square.selectedProperty().addListener(((observable, oldValue, newValue) -> {
            p.toggleSquare = newValue;
        }));

        t_circle.selectedProperty().setValue(Boolean.valueOf(prop.getProperty("CircleToggle")));
        t_circle.selectedProperty().addListener(((observable, oldValue, newValue) -> {
            p.toggleCircle = newValue;
        }));

        t_triangle.selectedProperty().setValue(Boolean.valueOf(prop.getProperty("TriangleToggle")));
        t_triangle.selectedProperty().addListener(((observable, oldValue, newValue) -> {
            p.toggleTriangle = newValue;
        }));

        t_hexagon.selectedProperty().setValue(Boolean.valueOf(prop.getProperty("HexagonToggle")));
        t_hexagon.selectedProperty().addListener(((observable, oldValue, newValue) -> {
            p.toggleHex = newValue;
        }));

        t_cube.selectedProperty().setValue(Boolean.valueOf(prop.getProperty("CubeToggle")));
        t_cube.selectedProperty().addListener(((observable, oldValue, newValue) -> {
            p.toggleCube = newValue;
        }));

        t_squaref.selectedProperty().setValue(Boolean.valueOf(prop.getProperty("SquareToggleFill")));
        t_squaref.selectedProperty().addListener(((observable, oldValue, newValue) -> {
            p.toggleSquareFill = newValue;
        }));

        t_circlef.selectedProperty().setValue(Boolean.valueOf(prop.getProperty("CircleToggleFill")));
        t_circlef.selectedProperty().addListener(((observable, oldValue, newValue) -> {
            p.toggleCircleFill = newValue;
        }));

        t_trianglef.selectedProperty().setValue(Boolean.valueOf(prop.getProperty("SquareToggleFill")));
        t_trianglef.selectedProperty().addListener(((observable, oldValue, newValue) -> {
            p.toggleTriangleFill = newValue;
        }));

        t_hexagonf.selectedProperty().setValue(Boolean.valueOf(prop.getProperty("SquareToggleFill")));
        t_hexagonf.selectedProperty().addListener(((observable, oldValue, newValue) -> {
            p.toggleHexFill = newValue;
        }));

        t_cubef.selectedProperty().setValue(Boolean.valueOf(prop.getProperty("SquareToggleFill")));
        t_cubef.selectedProperty().addListener(((observable, oldValue, newValue) -> {
            p.toggleCubeFill = newValue;
        }));

        Double intH = Double.valueOf(prop.getProperty("Color Hue"));
        Double intS = (Double.valueOf(prop.getProperty("Color Sat")) / 100);
        Double intB = (Double.valueOf(prop.getProperty("Color Brightness")) / 100);
        Double intO = (Double.valueOf(prop.getProperty("Color Opacity")) / 100);
        colorPicker.valueProperty().setValue(Color.hsb(intH, intS, intB, intO));
        r_preview.setFill(Color.hsb(intH, intS, intB, intO));
        colorPicker.setOnAction((ActionEvent e) -> {
            p.startShapeH = (int) Math.round(colorPicker.getValue().getHue());
            p.startShapeS = (float) Math.round(colorPicker.getValue().getSaturation() * 100);
            p.startShapeB = (float) Math.round(colorPicker.getValue().getBrightness() * 100);
            p.opacity = (int) Math.round(colorPicker.getValue().getOpacity() * 100);

            r_preview.setFill(Color.hsb(colorPicker.getValue().getHue(), colorPicker.getValue().getSaturation(), colorPicker.getValue().getBrightness(), colorPicker.getValue().getOpacity()));
        });

        t_ratiol.selectedProperty().setValue(Boolean.valueOf(prop.getProperty("Ratio Link")));
        t_ratiol.selectedProperty().addListener(((observable, oldValue, newValue) -> {
            s_heightr.valueProperty().set(s_widthr.getValue());
        }));

        t_sizel.selectedProperty().setValue(Boolean.valueOf(prop.getProperty("Size Link")));
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
                props.setProperty("Color Hue", String.valueOf(p.startShapeH));
                props.setProperty("Color Sat", String.valueOf(p.startShapeS));
                props.setProperty("Color Brightness", String.valueOf(p.opacity));
                props.setProperty("Color Opacity", String.valueOf(p.startShapeB));
                props.setProperty("MaxSize", String.valueOf(p.maxSizeMultiplier));
                props.setProperty("MinSize", String.valueOf(p.minSizeMultiplier));
                props.setProperty("WidthRatio", String.valueOf(p.widthRatio));
                props.setProperty("HeightRatio", String.valueOf(p.widthRatio));
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
        Startup = true;
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
