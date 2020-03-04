package main;

import processing.Structured;
import processing.core.PApplet;

import java.util.logging.Level;
import java.util.logging.Logger;


public class Main {
    public static void main(String[] args) {
        com.sun.javafx.application.PlatformImpl.startup(() -> {
            try {
                PApplet.main(Structured.class);
            } catch (Exception ex) {
                Logger.getLogger(Structured.class.getName()).log(Level.SEVERE, null, ex);
            }
        });
    }
}