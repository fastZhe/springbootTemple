/**
 * Created by haocongshun on 2016/10/16.
 */
$(function () {
    $("#instruction").show();
    $("#database").hide();
    $("#admin").hide();
    $("#done").hide();
    $("#instruction-next").click(function () {
        $("#instruction").hide();
        $("#database").show();
        $("#admin").hide();
        $("#flow1").removeClass("process-done");
        $("#flow1").addClass("process-did");
        $("#flow2").removeClass("process-did");
        $("#flow2").addClass("process-done");
        
    });
    $("#database-next").click(function () {
        $("#instruction").hide();
        $("#database").hide();
        $("#admin").show();
        $("#flow2").removeClass("process-done");
        $("#flow2").addClass("process-did");
        $("#flow3").removeClass("process-did");
        $("#flow3").addClass("process-done");
    });
    $("#admin-next").click(function () {
        $("#instruction").hide();
        $("#database").hide();
        $("#admin").hide();
        $("#done").show();
        $("#flow3").removeClass("process-done");
        $("#flow3").addClass("process-did");
        $("#flow4").removeClass("process-did");
        $("#flow4").addClass("process-done");
    });
});
