[[image:Back.gif link="JavaAgent"]]
## Background
The only requirement for a class used to register a Java Agent is a premain method:
```java
package schuchert.agent;

import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.Instrumentation;

public class ConfigurableClassFileTransformerRedirector {
    public static void premain(String agentArguments, Instrumentation instrumentation) {
    }
}
```

This is a complete, minimal example. If this class is packaged in a jar file with a correct manifest, when the VM starts up, the premain method gets called and has a chance to register an instance of a ClassFileTransformer with the instrumentation instance.

registrar 

Here's a simple class that will report the unqualified class name and its package:
```java
package schuchert.agent;

import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.IllegalClassFormatException;
import java.security.ProtectionDomain;

public class ClassAndPackageNamePrintingClassFileTransformer implements ClassFileTransformer {

    public byte[] transform(ClassLoader loader, String fullyQualifiedClassName, Class<?> classBeingRedefined,
            ProtectionDomain protectionDomain, byte[] classofileBuffer) throws IllegalClassFormatException {
        String className = fullyQualifiedClassName.replaceAll(".*/", "");
        String pacakge = fullyQualifiedClassName.replaceAll("/[a-zA-Z$0-9_]*$", "");
        System.out.printf("Class: %s in: %s\n", className, pacakge);
        return null;
    }

}
```

To get this ClassFileTransformer registered, we'd change pre-main to the following:
```java
public static void premain(String agentArguments, Instrumentation instrumentation) {
    instrumentation.addTransformer(new ClassAndPackageNamePrintingClassFileTransformer());
}
```

## ConfigurableClassFileTransformerRegistrar
Below is the source for the registrar. Here are a couple of notes:
* Many of the output strings are exposed as package-level constants to make testing easier
* There's a static filed, ERROR_OUT, exposed for testability as well
* This class records the each class it instantiates in registeredTransformers, again for testability
* This class allows a : separated list of classes. E.g. rather than using multiple -javaagent: lines or passing parameters into the premain(...), I've choses to support a : separated list.
* If you want to see the tests that verify this class' functionality, look further below. Note that the test class uses JUnit 4.4 and JMock 2.4.

[[#ConfigurableClassFileTransformerRegistrar]]
```java
package schuchert.agent;

import java.io.PrintStream;
import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.Instrumentation;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

public class ConfigurableClassFileTransformerRegistrar {
    private static List<ClassFileTransformer> registeredTransformers = new LinkedList<ClassFileTransformer>();

    public static final String DEST_CLASS_PROPERTY_NAME = "schuchert.ClassFileTransformer";

    static final String INSTANTIATION_ERROR = "Unable to instantiate: %s\n";
    static final String CHECK_SYSTEM_PROPERTY_MESSAGE = "Please check setting for system property: %s\n";
    static final String EXAMPLE_MESSAGE = "e.g. -D%s=%s\n";

    static PrintStream ERROR_OUT = System.err;

    public static void premain(String agentArguments, Instrumentation instrumentation) {
        for (String className : getClassNames()) {
            addOneClassFileTransformer(instrumentation, className);
        }
    }

    public static Iterator<ClassFileTransformer> iterator() {
        return registeredTransformers.iterator();
    }

    private static void addOneClassFileTransformer(Instrumentation instrumentation, String className) {
        ClassFileTransformer classFileTransformer = createTargetTransformer(className);
        if (classFileTransformer != null) {
            instrumentation.addTransformer(classFileTransformer);
            registeredTransformers.add(classFileTransformer);
        }
    }

    private static ClassFileTransformer createTargetTransformer(String className) {
        ClassFileTransformer targetTransformer = null;

        if (className != null) {
            try {
                Class<?> targetTransformerClass = Class.forName(className);
                targetTransformer = (ClassFileTransformer) targetTransformerClass.newInstance();
            } catch (Exception e) {
                reportException(e, className);
            }
        }

        return targetTransformer;

    }

    private static String[] getClassNames() {
        String classNameList = System.getProperty(DEST_CLASS_PROPERTY_NAME);

        if (classNameListMissingOrEmpty(classNameList)) {
            reportUsage();
            return new String[] {};
        }

        String[] classNames = classNameList.split(":");
        for (int i = 0; i < classNames.length; ++i) {
            classNames[i] = classNames[i].trim();
        }
        return classNames;
    }

    private static boolean classNameListMissingOrEmpty(String classNameList) {
        return classNameList == null || classNameList.trim().length() == 0;
    }

    private static void reportException(Exception e, String className) {
        e.printStackTrace(ERROR_OUT);
        ERROR_OUT.printf(INSTANTIATION_ERROR, className);
        reportUsage();
    }

    private static void reportUsage() {
        ERROR_OUT.printf(CHECK_SYSTEM_PROPERTY_MESSAGE, DEST_CLASS_PROPERTY_NAME);
        ERROR_OUT.printf(EXAMPLE_MESSAGE, DEST_CLASS_PROPERTY_NAME, NullClassFileTransformer.class.getName());
    }
}
```

**ConfigurableClassFileTransformerRegistrarTest**
[[#ConfigurableClassFileTransformerRegistrarTest]]
```java
package schuchert.agent;

import java.io.PrintStream;
import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.Instrumentation;
import java.util.Properties;

import junit.framework.Assert;

import org.jmock.Expectations;
import org.jmock.Mockery;
import org.jmock.integration.junit4.JMock;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import util.MockeryUtil;

@RunWith(JMock.class)
public class ConfigurableClassFileTransformerRegistrarTest {
    Mockery context = MockeryUtil.createMockeryForConcreteClasses();
    Instrumentation insrumentationSpy;
    PrintStream errorOutSpy;

    @Before
    public void createInsrumentationSpy() {
        insrumentationSpy = context.mock(Instrumentation.class);
    }

    @Before
    public void createAndRegisterErrorOutSpy() {
        errorOutSpy = context.mock(PrintStream.class);
        ConfigurableClassFileTransformerRegistrar.ERROR_OUT = errorOutSpy;
    }

    @Before
    public void clearSystemProperty() {
        Properties systemProperties = System.getProperties();
        systemProperties.remove(ConfigurableClassFileTransformerRegistrar.DEST_CLASS_PROPERTY_NAME);
        System.setProperties(systemProperties);
        Assert.assertNull(System.getProperty(ConfigurableClassFileTransformerRegistrar.DEST_CLASS_PROPERTY_NAME));
    }

    @Test
    public void errorReportedAndNoClassRegisteredWhenNoSystemPropertyDefined() {
        expectMissingSystemPropertyMessage();
        ConfigurableClassFileTransformerRegistrar.premain("", insrumentationSpy);
    }

    @Test
    public void systemPropertyDefinedButNullAlwaysPassesBecuaseNotPossibleToCreaetNullSystemProperty() {
    }

    @Test
    public void missingSystemPropertyReportedAndNoClassRegisteredWhenSystemPropertyEmptyString() {
        expectMissingSystemPropertyMessage();

        setSystemProperty("");

        ConfigurableClassFileTransformerRegistrar.premain("", insrumentationSpy);
    }

    @Test
    public void missingSystemPropertyReportedAndNoClassRegisteredWhenSystemPropertyContainsNothingButSpaces() {
        expectMissingSystemPropertyMessage();

        setSystemProperty("   ");

        ConfigurableClassFileTransformerRegistrar.premain("", insrumentationSpy);
    }

    @Test
    public void noErrorsWhenSystemPropertySetToSingleClassThatExistsInClassPath() {
        expectRegistryOfNullClassFileTransformer();

        setSystemProperty(NullClassFileTransformer.class.getName());

        ConfigurableClassFileTransformerRegistrar.premain("", insrumentationSpy);
    }

    @Test
    public void noErrorsWhenSystemPropertySetToSingleClassWithSpacesOnEndsThatExistsInClassPath() {
        expectRegistryOfNullClassFileTransformer();

        setSystemProperty("   " + NullClassFileTransformer.class.getName() + "   ");

        ConfigurableClassFileTransformerRegistrar.premain("", insrumentationSpy);
    }

    @Test
    public void noErrorsWhenSystemPropertySetToMultipleClassesAllOfWhichAreInClassPath() {
        expectRegistryOfNullClassFileTransformer();
        expectRegistryOf(ClassAndPackageNamePrintingClassFileTransformer.class);

        setSystemProperty(NullClassFileTransformer.class.getName() + ":"
                + ClassAndPackageNamePrintingClassFileTransformer.class.getName());

        ConfigurableClassFileTransformerRegistrar.premain("", insrumentationSpy);
    }

    @Test
    public void noErrorsWhenSystemPropertySetToMultipleClassesWithSpacesAtEndsOfNames() {
        expectRegistryOfNullClassFileTransformer();
        expectRegistryOf(ClassAndPackageNamePrintingClassFileTransformer.class);

        setSystemProperty(" " + NullClassFileTransformer.class.getName() + " : "
                + ClassAndPackageNamePrintingClassFileTransformer.class.getName() + " ");

        ConfigurableClassFileTransformerRegistrar.premain("", insrumentationSpy);
    }

    @Test
    public void noClassRegisteredWhenSingleMissingClassInSystemProperty() {
        expectReportOfClassNotFound();

        setSystemProperty("MissingClassThatShouldNotExistInClassPathEver");

        ConfigurableClassFileTransformerRegistrar.premain("", insrumentationSpy);
    }

    @Test
    public void nullTransformerRegisteredWhenSingleBadClassNameInSystemProperty() {
        expectReportOfClassNotFound();

        setSystemProperty("InvalidClassName^^^^");

        ConfigurableClassFileTransformerRegistrar.premain("", insrumentationSpy);
    }

    @Test
    public void nullTransformerRegisteredForEachBadClassWhenBothGoodAndBadClassNamesInSystemProperty() {
        expectRegistryOfNullClassFileTransformer();
        expectReportOfClassNotFound();
        expectRegistryOf(ClassAndPackageNamePrintingClassFileTransformer.class);

        setSystemProperty(NullClassFileTransformer.class.getName() + ":InvalidClassname^^^:"
                + ClassAndPackageNamePrintingClassFileTransformer.class.getName());

        ConfigurableClassFileTransformerRegistrar.premain("", insrumentationSpy);
    }

    @Test
    public void classNotImplementingClassFileFormaterErrorReported() {
        expectClassCastException();
        expectReportOfMissingClass();
        expectMissingSystemPropertyMessage();

        setSystemProperty(getClass().getName());

        ConfigurableClassFileTransformerRegistrar.premain("", insrumentationSpy);
    }

    private void setSystemProperty(String value) {
        System.setProperty(ConfigurableClassFileTransformerRegistrar.DEST_CLASS_PROPERTY_NAME, value);
    }

    private void expectMissingSystemPropertyMessage() {
        context.checking(new Expectations() {
            {
                one(errorOutSpy).printf(with(equal(ConfigurableClassFileTransformerRegistrar.CHECK_SYSTEM_PROPERTY_MESSAGE)),
                        with(any(String.class)));
                one(errorOutSpy).printf(with(equal(ConfigurableClassFileTransformerRegistrar.EXAMPLE_MESSAGE)),
                        with(any(Object.class)));
            }
        });
    }

    private void expectRegistryOfNullClassFileTransformer() {
        expectRegistryOf(NullClassFileTransformer.class);
    }

    private void expectRegistryOf(final Class<?> clazz) {
        context.checking(new Expectations() {
            {
                one(insrumentationSpy).addTransformer((ClassFileTransformer) with(any(clazz)));
            }
        });
    }

    private void expectReportOfMissingClass() {
        context.checking(new Expectations() {
            {
                one(errorOutSpy).printf(with(equal(ConfigurableClassFileTransformerRegistrar.INSTANTIATION_ERROR)),
                        with(any(String.class)));
            }
        });

    }

    private void expectClassNotFoundExceptionReported() {
        context.checking(new Expectations() {
            {
                one(errorOutSpy).println(with(any(ClassNotFoundException.class)));
                ignoring(errorOutSpy).println(with(any(String.class)));
            }
        });
    }

    private void expectReportOfClassNotFound() {
        expectClassNotFoundExceptionReported();
        expectReportOfMissingClass();
        expectMissingSystemPropertyMessage();
    }

    private void expectClassCastException() {
        context.checking(new Expectations() {
            {
                one(errorOutSpy).println(with(any(ClassCastException.class)));
                ignoring(errorOutSpy).println(with(any(String.class)));
            }
        });

    }

}
```