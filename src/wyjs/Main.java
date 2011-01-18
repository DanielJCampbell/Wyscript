// This file is part of the Whiley-to-Java Compiler (wyjc).
//
// The Whiley-to-Java Compiler is free software; you can redistribute 
// it and/or modify it under the terms of the GNU General Public 
// License as published by the Free Software Foundation; either 
// version 3 of the License, or (at your option) any later version.
//
// The Whiley-to-Java Compiler is distributed in the hope that it 
// will be useful, but WITHOUT ANY WARRANTY; without even the 
// implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR 
// PURPOSE.  See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public 
// License along with the Whiley-to-Java Compiler. If not, see 
// <http://www.gnu.org/licenses/>
//
// Copyright 2010, David James Pearce. 

package wyjs;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import wyjs.lang.WhileyFile;
import wyjs.stages.WhileyLexer;
import wyjs.stages.WhileyParser;
import wyjs.util.ParseError;
import wyjs.util.SyntaxError;

public class Main {

  public static final int PARSE_ERROR = 1;
  public static final int CONTEXT_ERROR = 2;
  public static final int VERIFICATION_ERROR = 3;
  public static final int RUNTIME_ERROR = 4;
  public static final int UNKNOWN_ERROR = 5;

  public static PrintStream errout;
  public static final int MAJOR_VERSION;
  public static final int MINOR_VERSION;
  public static final int MINOR_REVISION;
  public static final int BUILD_NUMBER;

  static {
    try {
      errout = new PrintStream(System.err, true, "UTF8");
    } catch (Exception e) {
      errout = System.err;
    }

    // determine version numbering from the MANIFEST attributes
    String versionStr = Main.class.getPackage().getImplementationVersion();
    if (versionStr != null) {
      String[] vb = versionStr.split("-");
      String[] pts = vb[0].split("\\.");
      BUILD_NUMBER = Integer.parseInt(vb[1]);
      MAJOR_VERSION = Integer.parseInt(pts[0]);
      MINOR_VERSION = Integer.parseInt(pts[1]);
      MINOR_REVISION = Integer.parseInt(pts[2]);
    } else {
      System.err.println("WARNING: version numbering unavailable");
      MAJOR_VERSION = 0;
      MINOR_VERSION = 0;
      MINOR_REVISION = 0;
      BUILD_NUMBER = 0;
    }
  }

  public static int run(String[] args) {
    boolean verbose = false;

    ArrayList<String> whileypath = new ArrayList<String>();
    ArrayList<String> bootpath = new ArrayList<String>();
    int fileArgsBegin = 0;

    for (int i = 0; i != args.length; ++i) {
      if (args[i].startsWith("-")) {
        String arg = args[i];
        if (arg.equals("-help")) {
          usage();
          System.exit(0);
        } else if (arg.equals("-version")) {
          System.out.println("Whiley-to-Java Compiler (wyjc) version "
              + MAJOR_VERSION + "." + MINOR_VERSION + "." + MINOR_REVISION
              + " (build " + BUILD_NUMBER + ")");
          System.exit(0);
        } else if (arg.equals("-wp") || arg.equals("-whileypath")) {
          Collections.addAll(whileypath, args[++i].split(File.pathSeparator));
        } else if (arg.equals("-bp") || arg.equals("-bootpath")) {
          Collections.addAll(bootpath, args[++i].split(File.pathSeparator));
        } else if (arg.equals("-verbose")) {
          verbose = true;
        } else {
          throw new RuntimeException("Unknown option: " + args[i]);
        }

        fileArgsBegin = i + 1;
      }
    }

    if (fileArgsBegin == args.length) {
      usage();
      return UNKNOWN_ERROR;
    }

    whileypath.add(0, ".");
    whileypath.addAll(bootpath);

    try {

      try {
        ArrayList<File> files = new ArrayList<File>();
        for (int i = fileArgsBegin; i != args.length; ++i) {
          files.add(new File(args[i]));
        }
        compile(files);
      } catch (ParseError e) {
        if (e.filename() != null) {
          outputSourceError(e.filename(), e.start(), e.end(), e.getMessage());
        } else {
          System.err.println("syntax error (" + e.getMessage() + ").");
        }

        if (verbose) {
          e.printStackTrace(errout);
        }

        return PARSE_ERROR;
      } catch (SyntaxError e) {
        if (e.filename() != null) {
          outputSourceError(e.filename(), e.start(), e.end(), e.getMessage());
        } else {
          System.err.println("syntax error (" + e.getMessage() + ").");
        }

        if (verbose) {
          e.printStackTrace(errout);
        }

        return CONTEXT_ERROR;
      }
    } catch (Exception e) {
      errout.println("Error: " + e.getMessage());
      if (verbose) {
        e.printStackTrace(errout);
      }
      return UNKNOWN_ERROR;
    }

    return 0;
  }

  public static void main(String[] args) throws Exception {
    System.exit(run(args));
  }

  /**
   * Print out information regarding command-line arguments
   * 
   */
  public static void usage() {
    String[][] info = {
        { "version", "Print version information" },
        { "verbose", "Print detailed information on what the compiler is doing" },
        { "Nvc", "Don't check constraints at compile time" },
        { "nrc", "Don't check constraints at runtime\n" },
        { "whileypath <path>", "Specify where to find whiley (class) files" },
        { "wp <path>", "Specify where to find whiley (class) files" },
        { "bootpath <path>",
            "Specify where to find whiley standard library (class) files" },
        { "bp <path>",
            "Specify where to find whiley standard library (class) files" },
        { "debug:lexer", "Generate debug information for the lexer" },
        { "debug:checks", "Generate debug information on generated checks" },
        { "debug:pcs", "Generate debug information on propagated conditions" },
        { "debug:vcs", "Generate debug information on verification conditions" } };
    System.out.println("usage: wjc <options> <source-files>");
    System.out.println("Options:");

    // first, work out gap information
    int gap = 0;

    for (String[] p : info) {
      gap = Math.max(gap, p[0].length() + 5);
    }

    // now, print the information
    for (String[] p : info) {
      System.out.print("  -" + p[0]);
      int rest = gap - p[0].length();
      for (int i = 0; i != rest; ++i) {
        System.out.print(" ");
      }
      System.out.println(p[1]);
    }
  }

  /**
   * This method compiles the list of given Whiley files. In this case, the
   * pipeline is quite simple since compiling to JavaScript is much easier than
   * compiling to the JVM.
   * 
   * @param files
   * @throws IOException
   */
  public static void compile(List<File> files) throws IOException {
    ArrayList<WhileyFile> wyfiles = new ArrayList<WhileyFile>();
    for (File file : files) {
      WhileyLexer lexer = new WhileyLexer(file.getPath());
      WhileyParser parser = new WhileyParser(file.getPath(), lexer.scan());
      wyfiles.add(parser.read());
    }

    // we'll do the type checking here

    for (WhileyFile wf : wyfiles) {
      translate(wf);
    }
  }

  public static void translate(WhileyFile wf) throws IOException {
    String filename = wf.filename.replace(".whiley", ".js");
    FileOutputStream fout = new FileOutputStream(filename);
    PrintStream out = new PrintStream(fout);
    out.println("This is where we translate the files");
    out.close();
  }

  /**
   * This method simply reads in the input file, and prints out a given line of
   * text, with little markers (i.e. '^') placed underneath a portion of it.
   * 
   * @param fileArg
   *          - the name of the file whose line to print
   * @param start
   *          - the start position of the offending region.
   * @param end
   *          - the end position of the offending region.
   * @param message
   *          - the message to print about the error
   */
  public static void outputSourceError(String fileArg, int start, int end,
      String message) throws IOException {
    BufferedReader in = new BufferedReader(new InputStreamReader(
        new FileInputStream(fileArg), "UTF8"));

    int line = 0;
    String lineText = "";
    while (in.ready() && start >= lineText.length()) {
      start -= lineText.length() + 1;
      end -= lineText.length() + 1;
      lineText = in.readLine();
      line = line + 1;
    }

    errout.println(fileArg + ":" + line + ": " + message);
    // errout.println();
    errout.println(lineText);
    for (int i = 0; i <= start; ++i) {
      if (lineText.charAt(i) == '\t') {
        errout.print("\t");
      } else {
        errout.print(" ");
      }
    }
    for (int i = start; i <= end; ++i) {
      errout.print("^");
    }
    errout.println("");
  }
}
