package processing;

import javafx.App;
import javafx.Controller;
import javafx.scene.canvas.Canvas;
import javafx.stage.Stage;
import processing.core.PApplet;
import processing.core.PSurface;
import processing.javafx.PSurfaceFX;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.security.SecureRandom;
import java.util.Collections;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

public class Structured extends PApplet {

    public boolean hsbLabeled;
    public boolean display = false;
    public boolean generateCP5;
    public boolean sizeToggleRatio;
    public boolean toggleCircleFill;
    public boolean toggleHexFill;
    public boolean toggleSquareFill;
    public boolean toggleTriangleFill;
    public boolean toggleCubeFill;
    public boolean hsbMode;
    public boolean linkR;
    public boolean oldGenC;
    public boolean regentoggle;
    public boolean toggleCircle;
    public boolean toggleHex;
    public boolean toggleLine;
    public boolean toggleSquare;
    public boolean toggleTriangle;
    public boolean toggleCube;
    public float axiomAmount;
    public int alpha;
    public float startShapeR;
    public float startShapeG;
    public float startShapeB;
    public float randomShapeR;
    public float randomShapeG;
    public float randomShapeB;
    public float lerpFrequency;
    public float opacity;
    public float widthRatio;
    public float heightRatio;
    public float maxSizeMultiplier;
    public float minSizeMultiplier;
    public int complexity;
    public int stroke;
    public float gens;
    private String axiom;
    public float scatter;
    public int osize;
    public int size;
    public int xSpread;
    public int ySpread;
    private String ruleW;
    private String ruleX;
    private String ruleY;
    private String ruleZ;
    public int Fill;
    public int Shape;
    public int Speed;
    public int squareSize;
    public int Transparency;
    private int borderSize;
    public int currentBoxNum;
    public int save;
    private static String OS = null;
    private File macDir = new File(System.getProperty("user.home") + File.separator + "Documents" + File.separator + "StructureGen");
    public File macDatadir = new File(System.getProperty("user.home") + "/Library/" + "Structured");
    private File macSavesdir = new File(macDir + File.separator + "Saves");
    private File imageSaveCountTXT = new File(macDatadir + File.separator + "Data" + File.separator + "imageSaveCount.txt");
    private File lastUsedGenPatternTXT = new File(macDatadir + File.separator + "Data" + File.separator + "lastUsedGenPattern.txt");
    private String[] prefs;
    private String[] lastuv;
    private String[] defaultPrefs;
    private String[] imageSaveCount;
    public static Controller c;
    public Properties props = new Properties();


    private static boolean isWindows() {
        return getOsName().startsWith("Windows");
    }

    private static boolean isMac() {
        return getOsName().startsWith("Mac");
    }

    private static boolean isUnix() {
        return (getOsName().contains("nix") || getOsName().contains("nux") || getOsName().indexOf("aix") > 0);
    }

    private static String getOsName() {
        if (OS == null) {
            OS = System.getProperty("os.name");
        }
        return OS;
    }

    private void OSCheck() {
        if (isMac()) {
            if (!macDir.exists() || !macDatadir.exists()) {
                System.out.println("creating directory: " + macDir.getName());
                boolean result = false;

                try {
                    macDir.mkdir();
                    macDatadir.mkdir();
                    macSavesdir.mkdir();
                    imageSaveCountTXT.createNewFile();
                    //lastUsedValuesTXT.createNewFile();
                    lastUsedGenPatternTXT.createNewFile();
                    FileWriter imgSCTXTW = new FileWriter(imageSaveCountTXT);
                    imgSCTXTW.write("0");
                    imgSCTXTW.close();
                    result = true;
                    //FileWriter lastUVTXTW = new FileWriter(lastUsedValuesTXT);
                    //lastUVTXTW.write("120\n" + "255.0\n" + "255.0\n" + "2\n" + "255.0\n" + "0.55\n" + "0.55\n" + "0.15\n" + "0.15\n" + "30\n" + "700\n" + "1.0\n" + "5\n" + "5.0\n" + "50.0\n" + "true\n" + "true\n" + "true\n" + "true\n" + "true\n" + "false\n" + "true\n" + "true\n" + "true\n" + "true\n" + "false\n" + "false\n" + "true\n" + "true\n" + "0.7\n" + "\n");
                    //lastUVTXTW.close();
                    FileWriter lastUGPTXT = new FileWriter(lastUsedGenPatternTXT);
                    lastUGPTXT.write("0");
                    lastUGPTXT.close();
                } catch (SecurityException se) {
                    //handle it
                } catch (IOException e) {
                    e.printStackTrace();
                }
                if (result) {
                    System.out.println("DIR created");
                }
            }
            //Create the file
            try {
                if (imageSaveCountTXT.createNewFile()) {
                    System.out.println("File is created!");
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
            /*try {
                if (lastUsedValuesTXT.createNewFile()) {
                    System.out.println("File is created!");
                }
            } catch (IOException e) {
                e.printStackTrace();
            }*/
            try {
                if (lastUsedGenPatternTXT.createNewFile()) {
                    System.out.println("File is created!");
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
            clearEmptyFiles();
        }
    }

    @Override
    protected PSurface initSurface() {
        g = createPrimaryGraphics();
        PSurface genericSurface = g.createSurface();
        PSurfaceFX fxSurface = (PSurfaceFX) genericSurface;
        fxSurface.sketch = this;
        App.surface = fxSurface;
        Controller.surface = fxSurface;

        try {
            //Application.launch(App.class);
            new App().start(new Stage());
        } catch (Exception ex) {
            Logger.getLogger(Structured.class.getName()).log(Level.SEVERE, null, ex);
        }

        while (fxSurface.stage == null) {
            try {
                Thread.sleep(5);
            } catch (InterruptedException ignored) {
            }
        }

        this.surface = fxSurface;
        Canvas canvas = (Canvas) surface.getNative();
        return surface;
    }

    @Override
    public void settings() {
        size(0, 0, FX2D);
    }

    @Override
    public void setup() {
        Controller.p = this;
        background(0);
        regentoggle = true;
        randomShapeR = 255;
        randomShapeG = 255;
        randomShapeB = 255;

        prefs = loadStrings(macDatadir + File.separator + "Data" + File.separator + "lastusedvalues.txt");
        lastuv = loadStrings(macDatadir + File.separator + "Data" + File.separator + "lastUsedGenPattern.txt");

        OSCheck();
    }

    @Override
    public void draw() {
        if (isMac()) {
            imageSaveCount = loadStrings(imageSaveCountTXT);
            /*            try {
                            FileWriter lastUGPTXTW = new FileWriter(lastUsedGenPatternTXT);
                            lastUGPTXTW.write(wField.getText() + "\n" + xField.getText() + "\n" + yField.getText() + "\n" + zField.getText());
                            lastUGPTXTW.close();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }*/
        }

        if (startShapeR < 0 && startShapeG < 0 && startShapeB < 0) {
            randomShapeR = random(randomShapeR - lerpFrequency, randomShapeR + lerpFrequency);
        } else {
            randomShapeR = startShapeR;
            randomShapeG = startShapeG;
            randomShapeB = startShapeB;

        }

        colorMode(HSB);
    }

    public void onGenerate() {
        String gen = RandomString.structure;
        RandomString genfour = new RandomString(4, new SecureRandom(), gen), genthree = new RandomString(3, new SecureRandom(), gen), gentwo = new RandomString(2, new SecureRandom(), gen);
        ruleW = (gentwo.nextString() + "++" + genthree.nextString() + gentwo.nextString() + "[" + genthree.nextString() + gentwo.nextString() + "]++");
        ruleX = ("+YF" + genfour.nextString() + "[" + gentwo.nextString() + gentwo.nextString() + genfour.nextString() + "]+");
        ruleY = ("-WF" + genfour.nextString() + "[" + genfour.nextString() + genfour.nextString() + "]-");
        ruleZ = ("--YF+^+WF[+ZF++++XF]--XF");

        CSystem cs = new CSystem();

        if (isMac()) {
            /*saveStrings(lastUsedValuesTXT, new String[]{
                    "" + startShapeR + "\n" + startShapeG + "\n" + startShapeB + "\n" + lerpFrequency + "\n" + opacity + "\n" + widthRatio + "\n" + heightRatio + "\n" + maxSizeMultiplier + "\n" + minSizeMultiplier + "\n" + alpha + "\n" + complexity + "\n" + stroke + "\n" + gens + "\n" + axiomAmount + "\n" + scatter + "\n" + toggleLine + "\n" + toggleSquare + "\n" + toggleCircle + "\n" + toggleTriangle + "\n" + toggleHex + "\n" + toggleCube + "\n" + toggleSquareFill + "\n" + toggleCircleFill + "\n" + toggleTriangle + "\n" + toggleHexFill + "\n" + "" + "\n" + oldGenC + "\n" + hsbMode + "\n" + sizeToggleRatio + "\n" + size + "\n" + toggleCircleFill + "\n"
            });*/
            beginRecord(PDF, macDir + File.separator + "Saves" + File.separator + "Structure-" + PApplet.parseInt(imageSaveCount[0]) + ".pdf");
        }

        cs.simulate((int) gens);
        cs.render();
    }

    public void onSave() {
        if (isMac()) {
            imageSaveCount = loadStrings(imageSaveCountTXT);
        }
        endRecord();
        System.out.println("Saved");
        saveStrings(imageSaveCountTXT, new String[]{
                "" + (PApplet.parseInt(imageSaveCount[0]) + 1)

        });
    }

    private void clearEmptyFiles() {
        File[] files = macDatadir.listFiles();
        assert files != null;
        for (File f : files) {
            if (f.length() == 0) {
                f.delete();
            }
        }
    }


/*    public void updateColorPickers() {
            startShapePreview.setColorBackground(blendColor(color(0), color(startShapeR, startShapeG, startShapeB, opacitySlider.getValue()), BLEND));
                startShapeRSlider.setColorForeground(color(startShapeR, 0, 0)).setColorActive(color(startShapeR, 0, 0)); //.setColorValue(int(255 - (startShapeR < 0? 0 : startShapeR)));
                startShapeGSlider.setColorForeground(color(0, startShapeG, 0)).setColorActive(color(0, startShapeG, 0)); //.setColorValue(int(255 - (startShapeG < 0? 0 : startShapeG)));
                startShapeBSlider.setColorForeground(color(0, 0, startShapeB)).setColorActive(color(0, 0, startShapeB)); //.setColorValue(int(255 - (startShapeB < 0? 0 : startShapeB)));
                s_rh.setBackground();
    }*/

    public void redraw() {
        int bgColor = 255;
        background(bgColor);
    }

    //Custom shapes not default in Processing

    private void tri(float w, float h) {
        beginShape();
        vertex((float) 0 + w / 2, (float) 0 + h);
        vertex((float) 0 + w, (float) 0);
        vertex((float) 0, (float) 0);
        endShape(CLOSE);
    }

    private void hex(float w, float h) {
        //(height/2)*cos(radians(60))= distance from top/bottom
        beginShape();
        vertex((float) 0 + w / 2, (float) 0); //top
        vertex((float) 0 + w, (float) 0 + (h / 2) * cos(radians(60))); //top right
        vertex((float) 0 + w, (float) 0 + h - (h / 2) * cos(radians(60))); //bottom right
        vertex((float) 0 + w / 2, (float) 0 + h); //bottom
        vertex((float) 0, (float) 0 + h - (h / 2) * cos(radians(60))); //bottom left
        vertex((float) 0, (float) 0 + (h / 2) * cos(radians(60))); //top left
        //vertex(x + w/2, y + h/2); //center
        endShape(CLOSE);
    }

    private void cube(float w, float h) {
        beginShape();
        vertex((float) 0 + w / 2, (float) 0); //top
        vertex((float) 0 + w, (float) 0 + (h / 2) * cos(radians(60))); //top right
        vertex((float) 0 + w / 2, (float) 0 + h / 2); //center
        vertex((float) 0, (float) 0 + (h / 2) * cos(radians(60))); //top left
        endShape(CLOSE);

        beginShape();
        vertex((float) 0 + w, (float) 0 + (h / 2) * cos(radians(60))); //top right
        vertex((float) 0 + w, (float) 0 + h - (h / 2) * cos(radians(60))); //bottom right
        vertex((float) 0 + w / 2, (float) 0 + h); //bottom
        vertex((float) 0 + w / 2, (float) 0 + h / 2); //center
        endShape(CLOSE);

        beginShape();
        vertex((float) 0 + w / 2, (float) 0 + h); //bottom
        vertex((float) 0, (float) 0 + h - (h / 2) * cos(radians(60))); //bottom left
        vertex((float) 0, (float) 0 + (h / 2) * cos(radians(60))); //top left
        vertex((float) 0 + w / 2, (float) 0 + h / 2); //center
        endShape(CLOSE);
    }

    class LSystem {
        String rule;
        String production;

        float startLength;
        float drawLength;
        float theta;

        int generations;

        LSystem() {
            axiom = "F";
            rule = "F+F-F";
            startLength = (float) 190.0;
            theta = radians((float) 120.0);
            reset();
        }

        void reset() {
            production = axiom;
            drawLength = startLength;
            generations = 0;
        }

        void simulate(int gen) {
            while (getAge() < gen) {
                production = iterate(production, rule);
            }
        }

        int getAge() {
            return generations;
        }

        String iterate(String prod_, String rule_) {
            generations++;
            String newProduction = prod_;
            newProduction = newProduction.replaceAll("F", rule_);
            return newProduction;
        }
    }

    public void setConfigVars() {

    }

    @SuppressWarnings("IntegerDivisionInFloatingPointContext")
    class CSystem extends LSystem {

        int steps = 0;

        //Generating Seeds for Generation
        CSystem() {
            axiom = String.join("", Collections.nCopies((int) axiomAmount, "[X]++"));
            String gen = RandomString.structure;
            RandomString genfour = new RandomString(4, new SecureRandom(), gen), genthree = new RandomString(3, new SecureRandom(), gen), gentwo = new RandomString(2, new SecureRandom(), gen);
            ruleW = (gentwo.nextString() + "++" + genthree.nextString() + gentwo.nextString() + "[" + genthree.nextString() + gentwo.nextString() + "]++");
            ruleX = ("+YF" + genfour.nextString() + "[" + gentwo.nextString() + gentwo.nextString() + genfour.nextString() + "]+");
            ruleY = ("-WF" + genfour.nextString() + "[" + genfour.nextString() + genfour.nextString() + "]-");
            ruleZ = ("--YF+^+WF[+ZF++++XF]--XF");
            //axiom = "[X++[X]++[X]++[X]++[X]";
            //ruleW = "YF++ZF4-XF[-YF4-WF]++";
            //ruleX = "+YF--ZF[3-WF--XF]+";
            //ruleY = "-WF++XF[+++YF++ZF]-";
            //ruleZ = "--YF++++WF[+ZF++++XF]--XF";
            startLength = (float) 460.0;
            theta = radians(36);
            reset();
        }

        //Reset value back to 0 for next part
        void reset() {
            production = axiom;
            drawLength = startLength;
            generations = 0;
        }

        int getAge() {
            return generations;
        }


        String iterate(String prod_, String rule_) {
            StringBuilder newProduction = new StringBuilder();
            for (int i = 0; i < prod_.length(); i++) {
                char step = production.charAt(i);
                if (step == 'W') {
                    newProduction.append(ruleW);
                } else if (step == 'X') {
                    newProduction.append(ruleX);
                } else if (step == 'Y') {
                    newProduction.append(ruleY);
                } else if (step == 'Z') {
                    newProduction.append(ruleZ);
                } else {
                    if (step != 'F') {
                        newProduction.append(step);
                    }
                }
            }

            drawLength = drawLength * size;
            generations++;
            return newProduction.toString();
        }


        void render() {
            background(0);
            translate((width / 2), height - (height / 2));
            int pushes = 0;
            int repeats = 1;
            steps += complexity;
            if (steps > production.length()) {
                steps = production.length();
            }

            for (int i = 0; i < steps; i++) {
                int currentW = PApplet.parseInt(random((height + borderSize) * minSizeMultiplier, (height + borderSize) * maxSizeMultiplier));
                int currentH = (heightRatio >= 0 && widthRatio >= 0) ? PApplet.parseInt(currentW * heightRatio / widthRatio) : PApplet.parseInt(random((height + borderSize) * minSizeMultiplier, (height + borderSize) * maxSizeMultiplier));
                float randomROld = randomShapeR;
                while (randomShapeR == randomROld || randomShapeR * randomShapeR == (randomROld + 1) * (randomROld + 1)) {
                    randomShapeR = random(randomShapeR - lerpFrequency, randomShapeR + lerpFrequency);
                }
                float randomGOld = randomShapeG;
                while (randomShapeG == randomGOld || randomShapeG * randomShapeG == (randomGOld + 1) * (randomGOld + 1)) {
                    randomShapeG = random(randomShapeG - lerpFrequency, randomShapeG + lerpFrequency);
                }
                float randomBOld = randomShapeB;
                while (randomShapeB == randomBOld || randomShapeB * randomShapeB == (randomBOld + 1) * (randomBOld + 1)) {
                    randomShapeB = random(randomShapeB - lerpFrequency, randomShapeB + lerpFrequency);
                }

                if (alpha > 0) {
                    fill(randomShapeR, randomShapeG, randomShapeB, opacity);
                } else {
                    noFill();
                }
                char step = production.charAt(i);
                if (step == 'F') {
                    //stroke(255, alpha);

                    //Shape Toggle
                    strokeWeight(stroke);
                    for (int j = 0; j < repeats; j++) {
                        if (toggleLine) {
                            stroke(color(randomShapeR, randomShapeG, randomShapeB, opacity), alpha);
                            textSize(50);
                            if (oldGenC) {
                                line(0, 0, 0, -drawLength);

                            } else {
                                line(0, 0, currentW * (size), currentH * (size));

                            }
                        }
                        if (toggleSquare) {
                            if (toggleSquareFill) {
                                fill(color(randomShapeR, randomShapeG, randomShapeB, opacity), alpha);
                            } else {
                                noFill();
                            }
                            if (oldGenC) {
                                stroke(color(randomShapeR, randomShapeG, randomShapeB, opacity), alpha);
                                rect(0, 0, -drawLength, -drawLength);
                            } else {
                                stroke(color(randomShapeR, randomShapeG, randomShapeB, opacity), alpha);
                                rect(0, 0, currentW * (size), currentH * (size));
                            }
                        }
                        if (toggleCircle) {
                            if (toggleCircleFill) {
                                fill(color(randomShapeR, randomShapeG, randomShapeB, opacity), alpha);
                            } else {
                                noFill();
                            }
                            if (oldGenC) {
                                stroke(color(randomShapeR, randomShapeG, randomShapeB, opacity), alpha);
                                ellipse(0, 0, -drawLength, -drawLength);
                            } else {
                                stroke(color(randomShapeR, randomShapeG, randomShapeB, opacity), alpha);
                                ellipse(0, 0, currentW * (size), currentH * (size));
                            }
                        }
                        if (toggleTriangle) {
                            if (toggleTriangleFill) {
                                fill(color(randomShapeR, randomShapeG, randomShapeB, opacity), alpha);
                            } else {
                                noFill();
                            }
                            if (oldGenC) {
                                stroke(color(randomShapeR, randomShapeG, randomShapeB, opacity), alpha);
                                tri(-drawLength, -drawLength);
                            } else {
                                stroke(color(randomShapeR, randomShapeG, randomShapeB, opacity), alpha);
                                tri(currentW * (size), currentH * (size));
                            }
                        }
                        if (toggleHex) {
                            if (toggleHexFill) {
                                fill(color(randomShapeR, randomShapeG, randomShapeB, opacity), alpha);
                            } else {
                                noFill();
                            }
                            if (oldGenC) {
                                stroke(color(randomShapeR, randomShapeG, randomShapeB, opacity), alpha);
                                hex(-drawLength, -drawLength);
                            } else {
                                stroke(color(randomShapeR, randomShapeG, randomShapeB, opacity), alpha);
                                hex(currentW * (size), currentH * (size));
                            }
                        }
                        if (toggleCube) {
                            if (toggleCubeFill) {
                                fill(color(randomShapeR, randomShapeG, randomShapeB, opacity), alpha);
                            } else {
                                noFill();
                            }
                            if (oldGenC) {
                                stroke(color(randomShapeR, randomShapeG, randomShapeB, opacity), alpha);
                                cube(-drawLength, -drawLength);
                            } else {
                                stroke(color(randomShapeR, randomShapeG, randomShapeB, opacity), alpha);
                                cube(currentW * (size), currentH * (size));
                            }
                        }
                    }
                    translate(scatter, scatter);
                    repeats = 1;

                    //Translate seed to actual shape movement
                } else if (step == '+') {
                    for (int j = 0; j < repeats; j++) {
                        rotate(theta);
                    }
                    repeats = 1;
                } else if (step == '-') {
                    for (int j = 0; j < repeats; j++) {
                        rotate(-theta);
                    }
                    repeats = 1;
                } else if (step == '*') {
                    for (int j = 0; j < repeats; j++) {
                        rotate(theta * 2);
                    }
                    repeats = 1;
                } else if (step == '/') {
                    for (int j = 0; j < repeats; j++) {
                        rotate(theta / 2);
                    }
                    repeats = 1;
                } else if (step == '^') {
                    for (int j = 0; j < repeats; j++) {
                        rotate(theta * theta);
                    }
                    repeats = 1;
                } else if (step == '$') {
                    for (int j = 0; j < repeats; j++) {
                        rotate(theta * theta * theta);
                    }
                    repeats = 1;
                } else if (step == '[') {
                    pushes++;
                    pushMatrix();
                } else if (step == ']') {
                    popMatrix();
                    pushes--;
                } else if ((step >= 48) && (step <= 57)) {
                    repeats = (int) step - 48;
                }
            }
            // Unpush if we need too
            while (pushes > 0) {
                popMatrix();
                pushes--;
            }
        }

    }
}